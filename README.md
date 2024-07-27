# Tableau Multi-Select Parameter Extension

The Tableau Multi-Select Parameter extension enhances your data analysis capabilities by concatenating selected values from a filter, delimited by '|', and updating them into a parameter. This parameter can then be used in custom SQL queries or calculated fields, providing greater flexibility in data manipulation and visualization.

## How to Use:

1. **Download the Extension**: Obtain the extension from the following URL: [MultiSelectParameter.trex](https://biplovkarna017.github.io/MultiSelectParameter.trex).

2. **Open Your Tableau Dashboard**: Navigate to your desired dashboard in Tableau.

3. **Add the Extension**:
    - Drag the "Extension" object from the bottom left section of the Tableau interface to your dashboard.
    - Click "Access Local Extensions".
    - Select the `MultiSelectParameter.trex` file from your download directory.

4. **Configure the Extension**:
    - The Configure Extension dialog box will appear.
    - From the "Select Filter" dropdown, choose the filter you want to use as a parameter.
    - From the "Select Parameter" dropdown, select the parameter where the concatenated filter values will be stored.
    - Click "Save Settings".

Once configured, any selections made on the filter will be concatenated and stored in the selected parameter. You can then use this parameter in your custom SQL queries (e.g., `COLUMN_NAME REGEXP <<ParameterName>>`) or calculated fields (e.g., `REGEXP_MATCH([COLUMN_NAME], [ParameterName])`).

This extension streamlines the process of dynamic parameter creation and enables more complex and customizable data queries within Tableau.
