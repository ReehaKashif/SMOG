import pandas as pd
import streamlit as st
import numpy as np

# Sample data (replace this with your actual data loading step)
data = {
    "district": ["Attock", "Bahawalnagar", "Bahawalpur", "Bhakkar", "Chakwal", "Chiniot", "Dera Ghazi Khan", "Faisalabad", "Gujranwala", "Gujrat", "Hafizabad", "Jhang", "Jhelum", "Kasur", "Khanewal", "Khushab", "Lahore", "Layyah", "Lodhran", "Mandi Bahuddin"],
    "AQI": [38.276979, 120.56836, 83.939092, 62.714741, 45.796152, 99.114595, 76.615671, 108.983266, 51.225765, 59.786822, 62.146125, 82.534053, 56.005316, 83.352872, 109.292017, 52.904439, 80.762022, 81.950843, 113.368032, 51.043177]
}

df = pd.DataFrame(data)
df = df.set_index('district')

# Function to convert AQI to color
def aqi_to_color(aqi):
    if aqi <= 50:
        return '#00E400'  # Good
    elif aqi <= 100:
        return '#FFFF00'  # Moderate
    elif aqi <= 150:
        return '#FF7E00'  # Unhealthy for sensitive groups
    elif aqi <= 200:
        return '#FF0000'  # Unhealthy
    elif aqi <= 300:
        return '#8F3F97'  # Very Unhealthy
    else:
        return '#7E0023'  # Hazardous



def display_colored_table(df):
    df_html = df.to_html(escape=False, index=False)
    st.markdown(df_html, unsafe_allow_html=True)
def display_district_color(df):

    # Sort DataFrame by AQI in ascending order
    df_sorted = df.sort_values(by='AQI', ascending=True)

    # Add a column for colors based on AQI values
    df_sorted['Color'] = df_sorted['AQI'].apply(aqi_to_color)

    # Convert the DataFrame to a format suitable for display in Streamlit
    df_display = df_sorted.reset_index()
    # Apply color formatting to the AQI column
    df_display['Color'] = df_display.apply(lambda row: f'<div style="background-color:{row["Color"]}; color:black;">{np.round(row["AQI"], 3)}</div>', axis=1)

    # Display the colored table
    return display_colored_table(df_display[['district', 'AQI', 'Color']])

# Streamlit app
st.title('AQI Table for Districts in Punjab, Pakistan')


# Function to display the AQI table with colored AQI values
display_district_color(df)

