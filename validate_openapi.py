from openapi_spec_validator import validate_spec
from yaml import load, Loader

try:
    with open('C:/Users/joseg/Documents/GitHub/LevelUp/public/docs/api-documentation.yaml', 'r', encoding='utf-8') as f:
        spec = load(f, Loader=Loader)
        print("Validating OpenAPI specification...")
        validate_spec(spec)
        print("OpenAPI specification is valid!")
except Exception as e:
    print(f"OpenAPI Validation Error: {e}")
    print(f"Error type: {type(e)}")