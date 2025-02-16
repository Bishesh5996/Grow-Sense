# utils.py
import cv2
import numpy as np

def calculate_green_density(image_path):
    """
    Calculate the density of green pixels in an image.
    """
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image not found or unable to read.")
    
    # Convert the image to the HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define green color range in HSV
    lower_green = np.array([35, 40, 40])  # Adjust as needed
    upper_green = np.array([85, 255, 255])  # Adjust as needed
    
    # Create a mask for green areas
    green_mask = cv2.inRange(hsv_image, lower_green, upper_green)
    
    # Calculate the green pixel count
    green_pixels = cv2.countNonZero(green_mask)
    
    # Calculate the total pixel count
    total_pixels = image.shape[0] * image.shape[1]
    
    # Calculate the green density
    green_density = green_pixels / total_pixels
    
    return green_density

def calculate_growth_rate(density_t1, density_t2, time_difference):
    """
    Calculate the growth rate based on green density change over time.
    """
    growth_rate = (density_t2 - density_t1) / time_difference
    return growth_rate