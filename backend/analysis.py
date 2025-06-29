import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from matplotlib.ticker import ScalarFormatter

df2 = pd.read_csv('pso_results.csv')

# Extract columns into lists
execution_time = df2['Time (s)'].tolist()
fitness_score = df2['Fitness Score'].tolist()


df = pd.read_csv('convergence.csv', index_col=0)
mean_row = df.loc['Mean']
convergence_curve = mean_row.to_numpy()
iterations = list(range(1, len(convergence_curve) + 1))


print("PSO Analysis - 30 Runs")
print("=" * 30)

# Basic statistics
print(f"\nFitness Score Stats:")
print(f"Best: {min(fitness_score):.6f}")
print(f"Worst: {max(fitness_score):.6f}")
print(f"Mean: {np.mean(fitness_score):.6f}")
print(f"Std: {np.std(fitness_score):.6f}")

print(f"\nExecution Time Stats:")
print(f"Min: {min(execution_time):.2f}s")
print(f"Max: {max(execution_time):.2f}s")
print(f"Mean: {np.mean(execution_time):.2f}s")
print(f"Std: {np.std(execution_time):.2f}s")

# Create separate figures for each plot

# Figure 1: Fitness Score Line Plot
plt.figure(figsize=(10, 6))
plt.plot(range(1, 31), fitness_score, 'bo-', linewidth=2, markersize=6)
plt.title('Fitness Scores (30 Runs)', fontweight='bold', fontsize=14)
plt.xlabel('Run Number', fontsize=12)
plt.ylabel('Fitness Score', fontsize=12)
plt.grid(True, alpha=0.3)

# Set proper axis limits and formatting
# plt.xlim(0, 32)  # X-axis starts from 0
# plt.ylim(0, max(fitness_score) * 1.1)  # Y-axis starts from 0 with some padding

# Add statistical reference lines
plt.axhline(y=min(fitness_score), color='green', linestyle=':', alpha=0.7,
            label=f'Minimum: {min(fitness_score):.5f}')
plt.axhline(y=max(fitness_score), color='orange', linestyle=':', alpha=0.7,
            label=f'Maximum: {max(fitness_score):.5f}')
plt.axhline(y=np.mean(fitness_score), color='red', linestyle='--', alpha=0.7,
            label=f'Mean: {np.mean(fitness_score):.5f}')
plt.axhline(y=np.mean(fitness_score) + np.std(fitness_score), color='purple', linestyle='-.', alpha=0.6,
            label=f'Mean + Std: {np.mean(fitness_score) + np.std(fitness_score):.5f}')
plt.axhline(y=np.mean(fitness_score) - np.std(fitness_score), color='purple', linestyle='-.', alpha=0.6,
            label=f'Mean - Std: {np.mean(fitness_score) - np.std(fitness_score):.5f}')

plt.legend(loc='upper right')
plt.tight_layout()
plt.show()

# Figure 2: Execution Time Line Plot
plt.figure(figsize=(10, 6))
plt.plot(range(1, 31), execution_time, 'go-', linewidth=2, markersize=6)
plt.title('Execution Time (30 Runs)', fontweight='bold', fontsize=14)
plt.xlabel('Run Number', fontsize=12)
plt.ylabel('Time (seconds)', fontsize=12)
plt.grid(True, alpha=0.3)

# Set proper axis limits and formatting
# plt.xlim(0, 32)  # X-axis starts from 0
# plt.ylim(0, max(execution_time) * 1.1)  # Y-axis starts from 0 with some padding

# Add statistical reference lines
plt.axhline(y=min(execution_time), color='green', linestyle=':', alpha=0.7,
            label=f'Minimum: {min(execution_time):.2f}s')
plt.axhline(y=max(execution_time), color='orange', linestyle=':', alpha=0.7,
            label=f'Maximum: {max(execution_time):.2f}s')
plt.axhline(y=np.mean(execution_time), color='red', linestyle='--', alpha=0.7,
            label=f'Mean: {np.mean(execution_time):.2f}s')
plt.axhline(y=np.mean(execution_time) + np.std(execution_time), color='purple', linestyle='-.', alpha=0.6,
            label=f'Mean + Std: {np.mean(execution_time) + np.std(execution_time):.2f}s')
plt.axhline(y=np.mean(execution_time) - np.std(execution_time), color='purple', linestyle='-.', alpha=0.6,
            label=f'Mean - Std: {np.mean(execution_time) - np.std(execution_time):.2f}s')

plt.legend(loc='upper right')
plt.tight_layout()
plt.show()

# Figure 3: Convergence Curve
# Compute min, max, tighter padding
min_val = min(convergence_curve)
max_val = max(convergence_curve)
padding = (max_val - min_val) * 5
if padding == 0:
    padding = 0.00001

# Plot
plt.figure(figsize=(10, 6))
plt.plot(iterations, convergence_curve, 'mo-', linewidth=2, markersize=3)
plt.title('PSO Convergence Curve', fontweight='bold', fontsize=14)
plt.xlabel('Iterations', fontsize=12)
plt.ylabel('Best Fitness', fontsize=12)
plt.ylim(min_val - padding, max_val + padding)
plt.grid(True, alpha=0.3)

# Force readable decimal axis (not scientific notation)
plt.gca().yaxis.set_major_formatter(ScalarFormatter(useOffset=False))
plt.ticklabel_format(useOffset=False, style='plain')

plt.tight_layout()
plt.show()
print(f"\nConvergence Analysis:")
print(f"Initial fitness: {convergence_curve[0]:.6f}")
print(f"Final fitness: {convergence_curve[-1]:.6f}")
print(f"Improvement: {((convergence_curve[0] - convergence_curve[-1])/convergence_curve[0]*100):.1f}%")
