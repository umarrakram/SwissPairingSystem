# Excel Upload Template Guide

This guide explains how to prepare an Excel file for bulk player upload.

## File Format

The Excel file (`.xlsx` or `.xls`) should contain the following columns:

### Required Columns

1. **Name** - Player's full name (text)
2. **Rating** - Player's chess rating (number)
3. **University** - University or organization (text)

### Example Template

| Name              | Rating | University        |
|-------------------|--------|-------------------|
| Magnus Carlsen    | 2850   | Norway Chess Fed  |
| Hikaru Nakamura   | 2750   | US Chess Fed      |
| Fabiano Caruana   | 2800   | US Chess Fed      |
| Ding Liren        | 2780   | Chinese Chess Fed |
| Ian Nepomniachtchi| 2770   | Russia Chess Fed  |

## Important Notes

- **Column names are case-insensitive** - "Name", "name", and "NAME" all work
- **All columns are required** - Missing any column will cause an error
- **Rating must be numeric** - Text values in Rating column will be rejected
- **First row must be headers** - Data starts from row 2
- **Blank rows are skipped** - Empty rows won't cause errors

## Creating the File

### Using Microsoft Excel

1. Open Microsoft Excel
2. Create a new workbook
3. Add headers in row 1: Name, Rating, University
4. Fill in player data starting from row 2
5. Save as `.xlsx` format

### Using Google Sheets

1. Create a new Google Sheet
2. Add the headers and data
3. Download as "Microsoft Excel (.xlsx)"

### Using LibreOffice Calc

1. Open LibreOffice Calc
2. Add headers and data
3. Save as "Microsoft Excel 2007-365 (.xlsx)"

## Sample Data

You can use this sample data for testing:

```
Name,Rating,University
John Smith,1800,MIT
Jane Doe,1650,Stanford
Robert Johnson,1750,Harvard
Emily Davis,1700,Yale
Michael Brown,1820,Princeton
Sarah Wilson,1680,Columbia
David Martinez,1790,Cornell
Lisa Anderson,1710,Brown
James Taylor,1640,Dartmouth
Mary Thomas,1770,Penn
```

## Error Handling

The system will:
- ✅ Successfully import valid rows
- ❌ Report errors for invalid rows
- ℹ️ Show which row number had issues
- 📊 Display count of successful imports

### Common Errors

1. **Missing required fields**
   - Error: "Row X: Missing required fields (Name, Rating, University)"
   - Fix: Ensure all three columns have values

2. **Invalid rating value**
   - Error: "Row X: Invalid rating value"
   - Fix: Rating must be a number (e.g., 1800, not "1800 points")

3. **No file uploaded**
   - Error: "No file uploaded"
   - Fix: Select a file before clicking Upload

## Best Practices

1. **Test with small batch first** - Upload 2-3 players to verify format
2. **Check for duplicates** - System allows duplicates but may cause confusion
3. **Use consistent formatting** - Keep university names consistent
4. **Verify ratings** - Double-check rating values before upload
5. **Keep a backup** - Save the original file before upload

## After Upload

Once uploaded successfully:
- Players appear in the Players table
- You can edit individual players if needed
- You can delete players before starting the tournament
- Players are ready for pairing generation

## Tips

- **Rating range**: Typically 0-3000 for chess
- **University names**: Use full names or abbreviations consistently
- **Name format**: "First Last" or "Last, First" both work
- **Multiple universities**: Players from same university can be added

## Need Help?

If you encounter issues:
1. Check the error message for the specific row
2. Verify column names match exactly
3. Ensure file is .xlsx or .xls format
4. Try with a smaller sample first
5. Contact support if problems persist
