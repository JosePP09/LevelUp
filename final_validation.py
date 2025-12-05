# Comprehensive validation of the API documentation file
import yaml
from openapi_spec_validator import validate_spec
from yaml import load, Loader

print("Step 1: Validating YAML syntax...")
try:
    with open('C:/Users/joseg/Documents/GitHub/LevelUp/public/docs/api-documentation.yaml', 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"File length: {len(content)} characters")
        spec = load(content, Loader=Loader)
        print("YAML is syntactically valid!")
except Exception as e:
    print(f"YAML Error: {e}")

print("\nStep 2: Validating OpenAPI specification...")
try:
    validate_spec(spec)
    print("OpenAPI specification is valid!")
except Exception as e:
    print(f"OpenAPI Error: {e}")

print("\nStep 3: Checking for common formatting issues...")
with open('C:/Users/joseg/Documents/GitHub/LevelUp/public/docs/api-documentation.yaml', 'r', encoding='utf-8') as f:
    lines = f.readlines()

    # Check for proper ending
    if lines[-1].strip() == '':
        print("File ends with a blank line")
    else:
        print("File does not end with a blank line")

    # Check for mixed tabs/spaces issues
    has_mixed = False
    for i, line in enumerate(lines):
        if '\t' in line and any('  ' in part for part in line.split('\t')):
            print(f"Line {i+1} has mixed tabs and spaces")
            has_mixed = True
            break
    if not has_mixed:
        print("No mixed tabs and spaces detected")

print("\nAll validations completed!")