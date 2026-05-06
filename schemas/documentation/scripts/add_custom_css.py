import os
import argparse

parser = argparse.ArgumentParser(description="Add custom css to html file.")
parser.add_argument("html_file", help="Path to html file")
args = parser.parse_args()


def add_custom_css(output_html_path):
    custom_css = """
    <style>

    span[type="post"].operation-type.post {
    display: none;
    }

    button.sc-kzqdkY.fZRtWb strong.sc-dSIIpw.cMtbfc,
    button.sc-kzqdkY.fZRtWb div.sc-eeDRCY.sc-eBMEME.sc-dCFHLb.gvJSKt.dDrYQw.ctYaUb {
    display: none;
    }

    button.sc-kzqdkY.fZRtWb::before {
    content: "Response Content";
    font-weight: bold;
    color: #2A2A2A; 
    display: block; 
    }

    span.sc-eZYNyq.jjWbju.http-verb.post {
    display: none; 
    }

    ul.react-tabs__tab-list {
    display: none; 
    }

    </style>
    """
    try:
        resolved_path = os.path.abspath(output_html_path)
        

        if os.path.exists(resolved_path):
            with open(resolved_path, 'r', encoding='utf-8') as file:
                content = file.read()

            content = content.replace('</head>', custom_css + '</head>')
            with open(resolved_path, 'w', encoding='utf-8') as file:
                file.write(content)

            print("Custom CSS has been added to HTML documentation.")
        else:
            print(f"Generated HTML file not found")
    except Exception as e:
        print(f"Error while adding custom CSS: {e}")

add_custom_css(args.html_file)
