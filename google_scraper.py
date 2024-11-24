import requests
from bs4 import BeautifulSoup
import time 
from flask import Flask, jsonify
from typing import Dict, Tuple
app = Flask(__name__)


def get_google_internships() -> Dict[str, Tuple[str, str, str]]:
    
    
    url = "https://www.google.com/about/careers/applications/jobs/results/?q=intern&skills=CSE"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
    }
    
    internships_dict = {}
    
    try:
        print("Fetching data from Google Careers...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        job_cards = soup.find_all('div', {'class': 'sMn82b'})
        total_jobs = len(job_cards)
        
        print(f"\nFound {total_jobs} total internship positions")
        
        for index, card in enumerate(job_cards, 1):
            try:
                title = card.find('h3', {'class': 'QJPWVe'}).text.strip()
                
                location_elem = card.find('span', {'class': 'r0wTof'})
                location = location_elem.text.strip() if location_elem else "Location not specified"
                
                type_elems = card.find_all('span', {'class': 'RP7SMd'})
                job_type = "Internship"
                for elem in type_elems:
                    if elem.find('i', text='bar_chart'):
                        job_type = elem.find('span').text.strip()
                        break
                
                quals_div = card.find('div', {'class': 'Xsxa1e'})
                if quals_div and quals_div.find('ul'):
                    quals_list = quals_div.find('ul').find_all('li')
                    min_quals = "\n- " + "\n- ".join([q.text.strip() for q in quals_list])
                else:
                    min_quals = "Qualifications not specified"
                
                internships_dict[title] = (location, job_type, min_quals)
                
                print(f"\rProcessing: {index}/{total_jobs} internships ({(index/total_jobs)*100:.1f}%)", end="")
                
            except AttributeError as e:
                print(f"\nError processing job card {index}: {e}")
                continue
            
        print("\nCompleted processing all internships!")
        return internships_dict
        
    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return {}
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {}

def print_internships_details(internships: Dict[str, Tuple[str, str, str]]):

    if not internships:
        print("\nNo internships found or an error occurred.")
        return
    
    print("\n============ GOOGLE INTERNSHIPS DETAILS ============")
    print(f"Total Positions Found: {len(internships)}")
    print("="*50)
    
    for i, (title, details) in enumerate(internships.items(), 1):
        location, job_type, min_quals = details
        print(f"\n{i}. {title}")
        print("   " + "="*50)
        print(f"   Location: {location}")
        print(f"   Type: {job_type}")
        print(f"   Minimum Qualifications: {min_quals}")
        print("   " + "-"*50)

@app.route('/internships', methods=['GET'])
def internships():
    internships_data = get_google_internships()
    if not internships_data:
        return jsonify({"message": "No internships found or an error occurred."}), 404
    
    internships_list = []
    for title, details in internships_data.items():
        location, job_type, min_quals = details
        internships_list.append({
            "title": title,
            "location": location,
            "job_type": job_type,
            "qualification": min_quals
        })
    
    return jsonify(internships_list)

# def main():
#     print("Starting Google internship scraper...")
#     print("----------------------------------------")
    
#     internships = get_google_internships()
#     print_internships_details(internships)

if __name__ == "__main__":
    app.run(debug=True)