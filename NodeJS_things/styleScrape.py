import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin

def get_style_links(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all links in the main content area
    content_div = soup.find('div', {'class': 'mw-parser-output'})
    style_links = []
    
    if content_div:
        for link in content_div.find_all('a'):
            if link.get('href') and '/wiki/' in link.get('href'):
                # Exclude special pages and categories
                if not any(x in link['href'] for x in ['Category:', 'Special:', 'File:', 'List_of']):
                    full_url = urljoin('https://aesthetics.fandom.com', link['href'])
                    style_links.append((link.text.strip(), full_url))
    
    return style_links

def get_style_summary(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the first few paragraphs
        content_div = soup.find('div', {'class': 'mw-parser-output'})
        summary = ""
        
        if content_div:
            paragraphs = content_div.find_all('p')
            for p in paragraphs[:3]:  # Get first 3 paragraphs
                text = p.get_text().strip()
                if text:  # Only add non-empty paragraphs
                    summary += text + " "
        
        # Create a concise prompt-friendly summary
        summary = f"An aesthetic style characterized by {summary[:250]}..."
        return summary
    except Exception as e:
        return f"Error processing page: {str(e)}"

def main():
    base_url = "https://aesthetics.fandom.com/wiki/List_of_Aesthetics"
    styles_dict = {}
    skipped_styles = []
    
    # Get all style links
    print("Getting style links...")
    style_links = get_style_links(base_url)
    
    # Process each style
    print(f"Found {len(style_links)} styles. Processing each style...")
    print("Press Ctrl+C once to skip current style, twice to exit completely")
    
    for style_name, style_url in style_links:
        try:
            print(f"Processing {style_name}...")
            summary = get_style_summary(style_url)
            styles_dict[style_name] = {
                'url': style_url,
                'summary': summary
            }
            time.sleep(1)  # Be nice to the server
            
        except KeyboardInterrupt:
            print(f"\nSkipping {style_name}...")
            skipped_styles.append(style_name)
            try:
                time.sleep(1)  # Give user time to release Ctrl+C
                continue
            except KeyboardInterrupt:
                print("\nDouble interrupt detected, stopping script...")
                break
                
        except Exception as e:
            print(f"Error processing {style_name}: {str(e)}")
            skipped_styles.append(style_name)
            continue
    
    # Save to JSON file
    with open('aesthetic_styles.json', 'w', encoding='utf-8') as f:
        json.dump(styles_dict, f, ensure_ascii=False, indent=2)
    
    if skipped_styles:
        print("\nSkipped styles:")
        for style in skipped_styles:
            print(f"- {style}")
    
    print("Done! Results saved to aesthetic_styles.json")

if __name__ == "__main__":
    main()