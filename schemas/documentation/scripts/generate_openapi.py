import json
import os
from typing import OrderedDict
import yaml
from collections import OrderedDict

def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f, object_pairs_hook=OrderedDict)

# Load JSON data from a file
filename = 'example_description.json'  # Replace with your JSON file name
try:
    with open(filename, 'r', encoding='utf-8') as file:
        example_data = json.load(file)
except FileNotFoundError:
    print("File not found.")
    example_data = None
except json.JSONDecodeError:
    print("Error decoding JSON.")
    example_data = None

def normalize_path(file_path):
    return file_path.replace("\\", "/") if file_path else None


def get_parameters(json_obj, key, index):
    if json_obj is None:
        return None, "JSON data not available."

    # Check if the key exists in the JSON object
    if key in json_obj:
        # Get the dictionary associated with the key
        operations = json_obj[key]
        
        # Convert the dictionary items to a list
        items = list(operations.items())
        
        # Check if the index is within the range
        if 0 <= index < len(items):
            # Get the specified item
            item_key, item_value = items[index]
            return item_key, item_value
        else:
            return f"example{index+1}", None
    else:
        return f"example{index+1}", None

def extract_examples(schema_content):
    title = "example"
    if "title" in schema_content:
        title = schema_content["title"]
    if "examples" in schema_content:
        examples = schema_content["examples"]
        if isinstance(examples, list):
            return {f"{get_parameters(example_data, title, i)[0]}": {"description":get_parameters(example_data, title, i)[1], "value": example} for i, example in enumerate(examples)}
    return {}
            

sections = {
    "control": {
        "request_dir": "commands/control",
        "response_dir": "response/control",
        "description": "Control commands are structured APIs that enable users to control Handheld RFID device operations. These commands facilitate actions such as starting or stopping inventory scans, retrieving or setting operating modes, and configuring post-filters, ensuring precise and efficient control over the device's functionality.",
        "tag": "Control",
    },
    "device_management": {
        "request_dir": "commands/dev_mgmt",
        "response_dir": "response/dev_mgmt",
        "description": "The Device Management Commands are focused on managing IoT devices by performing tasks like configuration, endpoint management, and operational control. These commands enable efficient device administration, ensuring proper functionality and interaction with the system. They are key to streamlining device operations and maintaining effective management workflows.",
        "tag": "Device Management",
    },
    "events": {
        "request_dir": "events",
        "response_dir": None,
        "description": "The events are triggered by specific occurrences in IoT systems, such as battery status changes, firmware updates, or network events. These events are used for monitoring system health, notifying users, handling exceptions, and logging system activities. They ensure efficient communication, timely interventions, and reliable operation of IoT ecosystems. Their purpose is to centralize event handling and streamline responses to various IoT scenarios.",
        "tag": "Events",
    },
    
}

openapi_structure = {
    "openapi": "3.0.0",
    "info": {
        "title": "Zebra IoT Connector for Handheld Readers",
        "version": "v2",
        "description": "Zebra IoT Connector API Documentation for Handheld Readers (RFD40/90) supported via Wi-Fi and Ethernet Interfaces. The interface is built on a web-friendly protocol MQTT and JSON-formatted data structures that can be leveraged by applications running on the cloud or on-premise to manage and control readers.",
        "x-logo": {
            "url": "https://logowik.com/content/uploads/images/zebra-technologies2902.jpg",
            "backgroundColor": "#FFFFFF",
            "altText": "Zebra IoT Connector Logo",
        },
    },
    "tags": [],
    "paths": {},
}

SKIP_CONTENT_APIS = {"get_config", "set_config", "alert_short"}
ENABLE_SKIP = False  # Set to False to include all APIs, True to exclude SKIP_CONTENT_APIS

for section_name, section_data in sections.items():
    request_dir = os.path.abspath(section_data["request_dir"])
    response_dir = os.path.abspath(section_data["response_dir"]) if section_data["response_dir"] else None
    description = section_data["description"]

    openapi_structure["tags"].append({
        "name": section_data["tag"],
        "description": description,
    })

    if not os.path.exists(request_dir):
        print(f"Error: Request directory '{request_dir}' does not exist.")
        continue

    if response_dir and not os.path.exists(response_dir):
        print(f"Warning: Response directory '{response_dir}' does not exist. Ignoring response files.")
        response_dir = None

    for filename in os.listdir(request_dir):
        if filename.endswith(".json"):
            request_path = normalize_path(os.path.abspath(os.path.join(request_dir, filename)))

            operation_id = os.path.splitext(filename)[0]

            try:
                request_content = load_json(request_path)  # Loads JSON while preserving order
            except json.JSONDecodeError:
                print(f"Error: Invalid JSON format in {request_path}. Skipping.")
                continue


            if ENABLE_SKIP and operation_id in SKIP_CONTENT_APIS:
                continue

            examples = extract_examples(request_content)

            content = {
                "application/json": {
                    "schema": {
                        "$ref": f"{normalize_path(request_path)}"
                    }
                }
            }

            if examples:
                content["application/json"]["examples"] = examples

            response_content_data = {}
            if response_dir and section_name != "events":
                response_path = normalize_path(os.path.abspath(os.path.join(response_dir, filename)))
                if os.path.exists(response_path):
                    try:
                        response_content = load_json(response_path)
                        response_examples = extract_examples(response_content)
                    except yaml.YAMLError:
                        print(f"Error: Invalid JSON format in {response_path}. Skipping.")
                        response_path = None

                    response_content_data = {
                        "description": "Success",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": f"{normalize_path(response_path)}"
                                }
                            }
                        }
                    }

                    if response_examples:
                        response_content_data["content"]["application/json"]["examples"] = response_examples

            openapi_structure["paths"][f"/{operation_id}"] = {
                "post": {
                    "tags": [section_data["tag"]],
                    "summary": operation_id,
                    "description": request_content.get("description", None),
                    "requestBody": {
                        "required": True,
                        "content": content,
                    },
                    "responses": {
                        "200": response_content_data
                    } if section_name != "events" else {}
                }
            }


script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
output_path = os.path.join(project_root, "openapi.json")

with open(output_path, "w", encoding="utf-8") as json_file:
    json.dump(openapi_structure, json_file, indent=4)

print(f"openapi.json has been generated successfully at {output_path}.")