export const templates = [
    {
        id: "blank", 
        label: "Blank Document", 
        imageUrl: "/blank-document.svg",
        initialContent: "",
    },
    {
        id: "software-proposal", 
        label: "Software development proposal", 
        imageUrl: "/software-proposal.svg",
        initialContent: `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Google Docs Template</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .toolbar {
                        width: 100%;
                        background: #f1f1f1;
                        padding: 10px;
                        display: flex;
                        gap: 10px;
                    }
                    .editor {
                        width: 80%;
                        min-height: 500px;
                        margin-top: 10px;
                        padding: 20px;
                        border: 1px solid #ccc;
                        outline: none;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                </style>
            </head>
            <body>
                <div class="toolbar">
                    <button onclick="document.execCommand('bold')">Bold</button>
                    <button onclick="document.execCommand('italic')">Italic</button>
                    <button onclick="document.execCommand('underline')">Underline</button>
                </div>
                <div class="editor" contenteditable="true">
                    Start typing here...
                </div>
            </body>
            </html>
            `
    },
    {
        id: "project-proposal", 
        label: "Project development proposal", 
        imageUrl: "/project-proposal.svg",
        initialContent: "",
    },
    {
        id: "business-letter", 
        label: "Business letter", 
        imageUrl: "/business-letter.svg",
        initialContent: "",
    },
    {
        id: "resume", 
        label: "Resume", 
        imageUrl: "/resume.svg",
        initialContent: "",
    },
    {
        id: "cover-letter", 
        label: "Cover letter", 
        imageUrl: "/cover-letter.svg",
        initialContent: "",
    },
    {
        id: "letter", 
        label: "Letter", 
        imageUrl: "/letter.svg",
        initialContent: "",
    },
    
];