import sys
import numpy as np
import cv2
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
                           QPushButton, QFileDialog, QLabel)
from PyQt6.QtCore import Qt
from pathlib import Path

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Image to SVG Converter")
        self.setGeometry(100, 100, 800, 600)

        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Add UI controls
        self.select_button = QPushButton("Select Image")
        self.select_button.clicked.connect(self.select_image)
        self.convert_button = QPushButton("Convert to SVG")
        self.convert_button.clicked.connect(self.convert_to_svg)
        self.status_label = QLabel("Select an image to begin")

        layout.addWidget(self.select_button)
        layout.addWidget(self.convert_button)
        layout.addWidget(self.status_label)

        self.image_path = None

    def select_image(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "Select Image", "",
                                                 "Images (*.png *.jpg *.bmp)")
        if file_name:
            self.image_path = file_name
            self.status_label.setText(f"Selected: {Path(file_name).name}")

    def convert_to_svg(self):
        if not self.image_path:
            self.status_label.setText("Please select an image first")
            return

        try:
            paths = self.trace_image(self.image_path)
            self.save_svg(paths, self.image_path)
            self.status_label.setText("Conversion completed!")
        except Exception as e:
            self.status_label.setText(f"Error: {str(e)}")

    def trace_image(self, image_path):
        # Read and preprocess image
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        _, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)
        
        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_LIST, 
                                     cv2.CHAIN_APPROX_TC89_KCOS)
        
        # Convert contours to SVG paths
        paths = []
        for contour in contours:
            if len(contour) > 2:  # Filter out tiny contours
                path = self.contour_to_path(contour)
                paths.append(path)
        return paths

    def contour_to_path(self, contour):
        path = []
        first_point = contour[0][0]
        path.append(f"M {first_point[0]},{first_point[1]}")
        
        for point in contour[1:]:
            x, y = point[0]
            path.append(f"L {x},{y}")
        
        path.append("Z")  # Close the path
        return " ".join(path)

    def save_svg(self, paths, original_path):
        img = cv2.imread(original_path)
        height, width = img.shape[:2]
        
        output_path = str(Path(original_path).with_suffix('.svg'))
        with open(output_path, 'w') as f:
            f.write(f'<svg width="{width}" height="{height}" '
                   f'xmlns="http://www.w3.org/2000/svg">\n')
            for path in paths:
                f.write(f'  <path d="{path}" fill="none" stroke="black"/>\n')
            f.write('</svg>')

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()