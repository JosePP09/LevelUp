import yaml
import sys

try:
    with open('C:/Users/joseg/Documents/GitHub/LevelUp/public/docs/api-documentation.yaml', 'r', encoding='utf-8') as f:
        content = f.read()
        print("Attempting to parse YAML...")
        data = yaml.safe_load(content)
        print("YAML is valid!")
except yaml.YAMLError as e:
    print(f"YAML Error: {e}")
    print(f"Error type: {type(e)}")
except Exception as e:
    print(f"General Error: {e}")
    print(f"Error type: {type(e)}")