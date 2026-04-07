import pandas as pd
import sys
import os

def update_excel(seq_id, new_start, new_end):
    file_path = r'C:\Users\AnishaP\hackathon\sequence_guardian_data.xlsx'
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found")
        return

    try:
        # Read the excel file
        df = pd.read_excel(file_path)
        
        # Check if sequence_code exists
        if seq_id in df['sequence_code'].values:
            # Update values
            # Assuming columns: sequence_code, sequence_startno, sequence_endno, sequence_currentval, etc.
            df.loc[df['sequence_code'] == seq_id, 'sequence_startno'] = int(new_start)
            df.loc[df['sequence_code'] == seq_id, 'sequence_endno'] = int(new_end)
            df.loc[df['sequence_code'] == seq_id, 'sequence_currentval'] = int(new_start) # Reset current to start
            
            # Save back to excel
            df.to_excel(file_path, index=False)
            print(f"Successfully updated {seq_id} in Excel")
        else:
            print(f"Error: Sequence ID {seq_id} not found in Excel")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) == 4:
        update_excel(sys.argv[1], sys.argv[2], sys.argv[3])
    else:
        print("Usage: python update_excel.py <seq_id> <start> <end>")
