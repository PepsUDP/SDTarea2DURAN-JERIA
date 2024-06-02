#snippet 1
# import pandas as pd

# def check_duplicates(input_csv, columns):
#     # Read the CSV file
#     df = pd.read_csv(input_csv)
    
#     # Check for duplicates based on the specified columns
#     duplicates = df[df.duplicated(subset=columns, keep=False)]
    
#     return duplicates

# # Example usage
# input_csv = 'restaurant-menus-smaller.csv'  # Replace with your input CSV file path
# columns = ['name', 'description']  # Replace with the column names you want to check for duplicates

# duplicates = check_duplicates(input_csv, columns)

# print("Duplicate entries based on columns:", columns)
# print(duplicates)

# snippet 2
# import pandas as pd

# def drop_columns(input_csv, output_csv, columns_to_drop):
#     # Read the CSV file into a DataFrame
#     df = pd.read_csv(input_csv)
    
#     # Drop the specified columns
#     df_dropped = df.drop(columns=columns_to_drop)
    
#     # Save the resulting DataFrame to a new CSV file
#     df_dropped.to_csv(output_csv, index=False)

# # Example usage
# input_csv = 'restaurant-menus.csv'  # Replace with your input CSV file path
# output_csv = 'restaurant-menus-small.csv'  # Replace with your output CSV file path
# columns_to_drop = ['restaurant_id', 'category']  # Replace with the column names you want to drop

# drop_columns(input_csv, output_csv, columns_to_drop)

# snippet 3
# import pandas as pd

# # Read the CSV file into a DataFrame
# df = pd.read_csv('restaurant-menus-cleaned.csv')

# max_length = 512  # Set the maximum length you want to check for

# # Create a new column 'exceeds_max_length' to store the boolean results, handling NaN values
# df['exceeds_max_length'] = df['name'].apply(lambda x: len(x) > max_length if isinstance(x, str) else False)

# # Eliminate the entries that exceed the max length
# df_cleaned = df[~df['exceeds_max_length']].copy()

# # Drop the 'exceeds_max_length' column as it's no longer needed
# df_cleaned.drop(columns=['exceeds_max_length'], inplace=True)

# print(df_cleaned)

# # Optionally, save the cleaned DataFrame to a new CSV file
# df_cleaned.to_csv('restaurant-menus-cleaned.csv', index=False)

# snippet 4
import pandas as pd

def extract_name_email_columns(input_csv, output_csv):
    # Read the original CSV file
    df = pd.read_csv(input_csv)
    
    # Add a new column named 'email' with the same content
    df['email'] = 'felipejeriamunoz@gmail.com'
    
    # Extract the "name" and "email" columns
    name_email_df = df[['name', 'email']]
        
    # Write the DataFrame to a new CSV file
    name_email_df.to_csv(output_csv, index=False)

# Example usage
input_csv = 'pedidos-full.csv'  # Replace with the path to your original CSV file
output_csv = 'pedidos-full.csv'  # Replace with the desired path for the new CSV file

extract_name_email_columns(input_csv, output_csv)

