import pandas as pd
import json
import numpy as np

# Load the Excel file
df = pd.read_excel("ExpList.xlsx")

# Convert real NaN and string "NaN" to None
df = df.replace({np.nan: None, "NaN": None, "nan": None, "": None})

# Force all remaining NaN-like values to None
df = df.astype(object).where(pd.notnull(df), None)

# Build JSON
data = {"ExperimentList": df.to_dict(orient="records")}

# Save to file
with open("ExpListConfig.json", "w") as f:
    json.dump(data, f, indent=4)

print("JSON saved.")