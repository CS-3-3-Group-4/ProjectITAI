import numpy as np
import json
import time

class PSOPersonnelAllocator:
    """
    This class encapsulates the entire Particle Swarm Optimization logic
    for allocating emergency response personnel. It now includes detailed logging.
    """
    def __init__(self, barangay_data, personnel_availability, flood_levels, pso_params, weights, lambda_c):
        """
        Initializes the PSO Allocator with all necessary data and parameters.
        """
        self.barangay_data = barangay_data
        self.personnel_availability = personnel_availability
        self.flood_levels = flood_levels
        self.pso_params = pso_params
        self.weights = weights
        self.lambda_c = lambda_c

        # --- UPDATED: Changed the threshold for affected areas ---
        self.target_barangays = {b_name: b_data for b_name, b_data in self.barangay_data.items() if self.flood_levels.get(b_name, 0) >= 0.5}
        self.num_target_barangays = len(self.target_barangays)

        self.total_personnel = {
            'srr': sum(p['srr'] for p in self.personnel_availability.values()),
            'health': sum(p['health'] for p in self.personnel_availability.values()),
            'log': sum(p['log'] for p in self.personnel_availability.values())
        }
        self.total_personnel_all_types = sum(self.total_personnel.values())

        self.demand = self._calculate_demand()

    def _calculate_demand(self):
        """ Calculates the personnel demand for each targeted barangay and classification. """
        demand = {}
        for name, data in self.target_barangays.items():
            flood_level = self.flood_levels.get(name, 0)
            demand[name] = {
                'srr': round(self.lambda_c['srr'] * data['risk'] * flood_level * np.log1p(data['population'])),
                'health': round(self.lambda_c['health'] * data['risk'] * flood_level * np.log1p(data['population'])),
                'log': round(self.lambda_c['log'] * data['risk'] * flood_level * np.log1p(data['population']))
            }
        return demand

    # --- Objective Functions (No changes here) ---
    def _objective1_coverage(self, allocation):
        if not self.target_barangays: return 0
        zones_with_personnel = sum(1 for barangay_alloc in allocation.values() if sum(barangay_alloc.values()) > 0)
        return zones_with_personnel / self.num_target_barangays

    def _objective2_prioritization(self, allocation):
        if self.total_personnel_all_types == 0: return 0
        numerator = sum(sum(barangay_alloc.values()) * np.log1p(self.target_barangays[name]['risk']) for name, barangay_alloc in allocation.items())
        return numerator / self.total_personnel_all_types

    def _objective3_distribution(self, allocation):
        zone_totals = [sum(barangay_alloc.values()) for barangay_alloc in allocation.values()]
        if not zone_totals: return 0
        mean = np.mean(zone_totals)
        std_dev = np.std(zone_totals)
        return std_dev / (mean + 1e-6) if mean > 0 else 0

    def _objective4_population(self, allocation):
        if self.total_personnel_all_types == 0: return 0
        numerator = sum(sum(barangay_alloc.values()) * np.log1p(self.target_barangays[name]['population']) for name, barangay_alloc in allocation.items())
        return numerator / self.total_personnel_all_types

    def _objective5_demand(self, allocation):
        if not self.target_barangays: return 0
        total_demand_satisfaction = 0
        num_classifications = 3
        for name, barangay_alloc in allocation.items():
            for p_type in ['srr', 'health', 'log']:
                demand_val = self.demand.get(name, {}).get(p_type, 0)
                alloc_val = barangay_alloc[p_type]
                satisfaction = min(1, alloc_val / demand_val) if demand_val > 0 else 1
                total_demand_satisfaction += satisfaction
        return total_demand_satisfaction / (self.num_target_barangays * num_classifications)

    def fitness_function(self, allocation):
        obj1 = self._objective1_coverage(allocation)
        obj2 = self._objective2_prioritization(allocation)
        obj3 = self._objective3_distribution(allocation)
        obj4 = self._objective4_population(allocation)
        obj5 = self._objective5_demand(allocation)
        fitness = (self.weights['w1'] * obj1 +
                   self.weights['w2'] * obj2 -
                   self.weights['w3'] * obj3 +
                   self.weights['w4'] * obj4 +
                   self.weights['w5'] * obj5)
        return fitness

    def _decode_particle(self, particle):
        allocation = {}
        idx = 0
        for name in self.target_barangays:
            allocation[name] = {
                'srr': int(particle[idx]),
                'health': int(particle[idx + 1]),
                'log': int(particle[idx + 2]),
            }
            idx += 3
        return allocation

    def _enforce_constraints(self, particle):
        for i, p_type in enumerate(['srr', 'health', 'log']):
            allocations = particle[i::3]
            total_allocated = np.sum(allocations)
            total_available = self.total_personnel[p_type]
            if total_allocated > total_available:
                ratio = total_available / total_allocated if total_allocated > 0 else 0
                particle[i::3] = np.round(allocations * ratio)
        return particle

    def run_pso(self):
        """
        Executes the PSO algorithm and returns detailed logs.
        """
        if self.num_target_barangays == 0:
            # Return a structure indicating no run was performed
            return { "allocation": {}, "fitness_score": 0 }, [], { "allocation": {}, "fitness_score": 0 }

        num_particles = self.pso_params['num_particles']
        num_iterations = self.pso_params['iterations']
        dim = self.num_target_barangays * 3

        # Initialize particles
        particles_pos = np.random.rand(num_particles, dim)
        for i in range(self.num_target_barangays):
            particles_pos[:, i*3] *= self.total_personnel['srr'] + 1
            particles_pos[:, i*3+1] *= self.total_personnel['health'] + 1
            particles_pos[:, i*3+2] *= self.total_personnel['log'] + 1
        particles_pos = np.round(particles_pos)

        particles_vel = np.zeros((num_particles, dim))
        pbest_pos = np.copy(particles_pos)
        pbest_fitness = np.array([self.fitness_function(self._decode_particle(p)) for p in pbest_pos])

        gbest_idx = np.argmax(pbest_fitness)
        gbest_pos = pbest_pos[gbest_idx].copy()
        gbest_fitness = pbest_fitness[gbest_idx]

        # --- Capture Initial State ---
        initial_state = {
            "allocation": self._decode_particle(gbest_pos),
            "fitness_score": float(gbest_fitness)
        }

        # --- Prepare for iteration logging ---
        iteration_log = []

        # PSO main loop
        for i in range(num_iterations):
            for j in range(num_particles):
                r1, r2 = np.random.rand(2)
                cognitive_vel = self.pso_params['c1'] * r1 * (pbest_pos[j] - particles_pos[j])
                social_vel = self.pso_params['c2'] * r2 * (gbest_pos - particles_pos[j])
                particles_vel[j] = self.pso_params['w'] * particles_vel[j] + cognitive_vel + social_vel

                particles_pos[j] = np.round(particles_pos[j] + particles_vel[j])
                particles_pos[j] = np.maximum(0, particles_pos[j])
                particles_pos[j] = self._enforce_constraints(particles_pos[j])

                current_fitness = self.fitness_function(self._decode_particle(particles_pos[j]))
                if current_fitness > pbest_fitness[j]:
                    pbest_fitness[j] = current_fitness
                    pbest_pos[j] = particles_pos[j].copy()

                    if current_fitness > gbest_fitness:
                        gbest_fitness = current_fitness
                        gbest_pos = particles_pos[j].copy()

            # --- Log progress every 50 iterations ---
            if (i + 1) % 50 == 0:
                iteration_log.append({
                    "iteration": i + 1,
                    "fitness_score": float(gbest_fitness),
                    "allocation": self._decode_particle(gbest_pos)
                })

        # --- Capture Final State ---
        final_result = {
            "allocation": self._decode_particle(gbest_pos),
            "fitness_score": float(gbest_fitness)
        }

        return initial_state, iteration_log, final_result


def run_pso_simulation(barangay_input_data):
    """
    Main function to run the PSO simulation.
    This function now prints detailed results and execution time to the terminal
    and returns the final allocation, fitness score, and execution time.
    """
    # Static Data
    static_barangay_data = {
        'Addition Hills': {'population': 35914, 'risk': 3}, 'Bagong Silang': {'population': 6867, 'risk': 2},
        'Barangka Drive': {'population': 13783, 'risk': 2}, 'Barangka Ibaba': {'population': 10555, 'risk': 3},
        'Barangka Ilaya': {'population': 10255, 'risk': 2}, 'Barangka Itaas': {'population': 5440, 'risk': 1},
        'Buayang Bato': {'population': 1307, 'risk': 3}, 'Burol': {'population': 2697, 'risk': 1},
        'Daang Bakal': {'population': 3656, 'risk': 2}, 'Hagdang Bato Itaas': {'population': 9625, 'risk': 1},
        'Hagdang Bato Libis': {'population': 5029, 'risk': 2}, 'Harapin Ang Bukas': {'population': 4554, 'risk': 2},
        'Highway Hills': {'population': 30488, 'risk': 2}, 'Hulo': {'population': 27533, 'risk': 3},
        'Ilaya': {'population': 6135, 'risk': 3}, 'Mabini-J.Rizal': {'population': 5026, 'risk': 2},
        'Malamig': {'population': 12295, 'risk': 2}, 'Namayan': {'population': 5738, 'risk': 3},
        'New Zaniga': {'population': 7291, 'risk': 2}, 'Old Zaniga': {'population': 6202, 'risk': 2},
        'Pag-asa': {'population': 4287, 'risk': 2}, 'Plainview': {'population': 24738, 'risk': 2},
        'Pleasant Hills': {'population': 6723, 'risk': 1}, 'Poblacion': {'population': 11848, 'risk': 3},
        'San Jose': {'population': 5988, 'risk': 2}, 'Vergara': {'population': 5420, 'risk': 2},
        'Wack-Wack Greenhills': {'population': 9109, 'risk': 1}
    }

    # Process Input Data
    personnel_availability = {b['name']: b['personnel'] for b in barangay_input_data}
    flood_levels = {b['name']: b['waterLevel'] for b in barangay_input_data}

    # PSO Parameters
    pso_params = {'iterations': 300, 'num_particles': 100, 'w': 0.5, 'c1': 1.5, 'c2': 1.5}
    weights = {'w1': 0.2, 'w2': 0.2, 'w3': 0.2, 'w4': 0.2, 'w5': 0.2}
    lambda_c = {'srr': 0.5, 'health': 0.3, 'log': 0.2}

    # Initialize Simulation
    allocator = PSOPersonnelAllocator(static_barangay_data, personnel_availability, flood_levels, pso_params, weights, lambda_c)

    print("\nTotal Available Personnel Received from Frontend:")
    print(f"  SRR: {allocator.total_personnel['srr']}")
    print(f"  HEALTH: {allocator.total_personnel['health']}")
    print(f"  LOG: {allocator.total_personnel['log']}")

    # --- Run Simulation and Measure Time ---
    start_time = time.time()
    initial_state, iteration_log, final_result = allocator.run_pso()
    end_time = time.time()
    execution_time = end_time - start_time

    # --- Log results to the terminal in a readable format ---
    print("\n--- PSO SIMULATION LOG ---")

    # Log Initial State
    print("\n[INITIAL STATE]")
    print(f"  Initial Fitness Score: {initial_state['fitness_score']:.4f}")
    if initial_state['allocation']:
        print("  Initial Allocation:")
        for name, p_alloc in initial_state['allocation'].items():
            print(f"    - {name}: SRR-{p_alloc['srr']}, HEALTH-{p_alloc['health']}, LOG-{p_alloc['log']}")
    else:
        print("  Initial Allocation: None")

    # Log Iteration Progress
    print("\n[ITERATION LOG]")
    for log_entry in iteration_log:
        print(f"  Iteration {log_entry['iteration']} -> Best Fitness: {log_entry['fitness_score']:.4f}")

    # Log Final Result
    print("\n[FINAL RESULT]")
    print(f"  Final Fitness Score: {final_result['fitness_score']:.4f}")
    if final_result['allocation']:
        print("  Final Allocation Strategy:")
        for name, p_alloc in final_result['allocation'].items():
            print(f"    - {name}: SRR-{p_alloc['srr']}, HEALTH-{p_alloc['health']}, LOG-{p_alloc['log']}")
    else:
        print("  Final Allocation: None")

    # Log Execution Time
    print("\n[EXECUTION TIME]")
    print(f"  Total execution time: {execution_time:.4f} seconds")

    print("\n--- END OF SIMULATION LOG ---\n")

    # Return the final allocation, fitness score, and execution time as a list (array)
    return [
        final_result['allocation'],
        final_result['fitness_score'],
        float(execution_time)
    ]


if __name__ == '__main__':
    # Test harness now shows the array return structure with execution time
    print("--- Running Test Simulation ---")

    sample_frontend_data = [
        {"id": "0", "name": "Addition Hills", "waterLevel": 2.5, "personnel": {"srr": 10, "health": 8, "log": 5}},
        {"id": "1", "name": "Bagong Silang", "waterLevel": 0.5, "personnel": {"srr": 5, "health": 5, "log": 5}},
        {"id": "2", "name": "Barangka Drive", "waterLevel": 1.1, "personnel": {"srr": 3, "health": 2, "log": 4}},
        {"id": "3", "name": "Barangka Ibaba", "waterLevel": 3.0, "personnel": {"srr": 15, "health": 12, "log": 10}},
        {"id": "25", "name": "Vergara", "waterLevel": 0.0, "personnel": {"srr": 0, "health": 0, "log": 0}},
        {"id": "26", "name": "Wack-Wack Greenhills", "waterLevel": 0.2, "personnel": {"srr": 2, "health": 2, "log": 1}}
    ]

    # The function will now print logs internally and return a simple list.
    simulation_result = run_pso_simulation(sample_frontend_data)

    print("\n--- FUNCTION RETURN VALUE ---")
    print(json.dumps(simulation_result, indent=2))
    print("--- END OF RETURN VALUE ---")
