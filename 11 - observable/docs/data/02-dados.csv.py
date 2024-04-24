import sys, os
import pandas as pd

real_path = os.path.realpath(__file__) .split("/")
real_path[-2] = "data"
real_path[-1] = "superstore.csv"

real_path = "/".join(real_path);
df = pd.read_csv(real_path, encoding = "utf-8")

print(df.to_json(orient='records'), file=sys.stdout)