
#  file-swap

  

**file-swap** is a command-line file conversion tool. It supports conversion between various formats for images, texts and documents.

  

<br>

  

  

##  Prerequisites

  

  

Ensure you have **Node.js** and **npm** installed on your machine before using this tool.

  

  

<br>

  

  

##  Installation & Usage

  

  

To use **file-swap**:

  

<br>


  

1. Install the package globally:

  

```bash
npm install file-swap
```

  

<br>


  

2. Convert files using the following syntax:

  

```bash
npx file-swap <filepath> <target-format> [options]
```

  

<br>


  

Example commands:

  

```bash
# Convert image to PNG
npx file-swap image.jpg png

# Convert to ICO with size option
npx file-swap logo.png ico --s  # small (16x16)

npx file-swap logo.png ico --m  # medium (32x32)

npx file-swap logo.png ico --l  # large (48x48)

# Convert and delete the original
npx file-swap image.jpg png -d
```

<br>

You can also view a help section by running the following command:
```bash
npx file-swap --help
```
  

  

<br>

  

  

##  Supported Formats

  

  

###  Image Formats

  

- JPEG/JPG

  

- PNG

  

- SVG

  

- WEBP

  

- ICO (with size options: small, medium, large)

  
<br>
  

###  Text Formats

  

- TXT (Plain Text)

  

- MD (Markdown)

  

- JSON

  

- YAML

  

- CSV


<br>

  

  

##  Text Format Conversion Details

  

  

###  CSV Conversion Behavior

  

-  **TXT/MD to CSV**: Each line becomes a row with a "content" column

  

-  **JSON/YAML to CSV**: Nested objects are flattened with underscore-separated keys

  

-  **Arrays in CSV**: Handled as numbered columns (e.g., array_0, array_1)

  

-  **Special Characters**: Automatically escaped in CSV output

  
<br>

  

###  Other Conversions

  

-  **JSON/YAML**: Preserves data structure and formatting

  

-  **TXT/MD**: Maintains text content and line breaks

  

-  **All formats**: Handles null values and empty fields gracefully

  

  

<br>

  

  

##  Development & Testing

  

  

To modify or test this package locally:

  

  
  

1. Clone the repository.

  

2. Run ```npm link``` in the project directory to make it available globally on your system.

3. Use the command `file-swap` to run locally.

  

  

<br>

  

  

##  License

  

  

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

  

  

<br>

  

  

##  Contributing

  

  

Contributions are welcome! Here's how you can help:

  

  

1. Fork the repository

  

2. Create a feature branch

  

3. Make your changes

  

4. Run the tests

  

5. Submit a pull request

  

<br>


  

I especially welcome contributions for:

  

- Additional format support

  

- Improved conversion algorithms

  

  

<br>

  

  

##  Notes

  

  

- Large files may require additional processing time

  

- Some conversions may result in loss of formatting (e.g., complex formatting in MD to TXT)

  

- ICO conversion requires specifying a size option

  

- CSV conversion works best with structured data