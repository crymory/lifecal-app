# Lifecal - Goal Calendar Wallpaper Generator

A Next.js application that generates beautiful goal calendar wallpapers for iPhone lock screens. Create unique, shareable links to track your progress towards any goal.

## Features

- 📱 Generate iPhone lock screen wallpapers with goal calendars
- 🔗 Create unique shareable links for each goal
- 📊 Visual progress tracking with color-coded days
- ⚙️ Easy iOS Shortcuts integration
- 🎨 Beautiful dark theme UI

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Generation**: Canvas (node-canvas)
- **Date Handling**: date-fns
- **ID Generation**: UUID

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 11+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lifecal-app.git
cd lifecal-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a Goal

1. Fill in your goal name (e.g., "No Sugar")
2. Set the start date
3. Set the deadline
4. Select your iPhone model
5. Click "Generate Calendar"

### Getting Your Wallpaper URL

After creating a goal, you'll receive a unique URL that generates a PNG calendar image. This URL can be:
- Copied to clipboard
- Used in iOS Shortcuts for automation
- Shared with others

### iOS Setup

1. Copy the generated URL
2. Open the Shortcuts app
3. Create a new automation: Time of Day → 6:00 AM → Daily
4. Add "Get Contents of URL" action and paste the URL
5. Add "Set Wallpaper Photo" action → Lock Screen
6. Disable "Crop to Subject" and "Show Preview" in options
7. Your lock screen will update automatically every morning!

## Project Structure

```
lifecal-app/
├── app/
│   ├── api/
│   │   ├── goals/
│   │   │   └── route.ts       # Goal CRUD operations
│   │   └── calendar/
│   │       └── route.ts       # Calendar image generation
│   ├── page.tsx               # Main form UI
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── data/
│   └── goals.json             # Goals database
├── public/                    # Static assets
├── package.json
└── tsconfig.json
```

## API Endpoints

### POST /api/goals
Create a new goal.

**Request:**
```json
{
  "name": "No Sugar",
  "startDate": "2026-02-20",
  "deadline": "2026-04-20",
  "iPhoneModel": "iPhone 13 / 13 Pro / 14 / 14 Pro"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "name": "No Sugar",
  "startDate": "2026-02-20",
  "deadline": "2026-04-20",
  "iPhoneModel": "iPhone 13 / 13 Pro / 14 / 14 Pro",
  "createdAt": "2026-02-20T10:00:00.000Z"
}
```

### GET /api/goals?id=goal-id
Retrieve a specific goal.

### GET /api/calendar
Generate a calendar image.

**Query Parameters:**
- `goal` - Goal name
- `goal_date` - Deadline (YYYY-MM-DD)
- `start_date` - Start date (YYYY-MM-DD)
- `width` - Image width in pixels (default: 1170)
- `height` - Image height in pixels (default: 2532)

**Returns:** PNG image

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Your app will be live!

**Note:** Canvas module requires native compilation. Vercel handles this automatically for Node.js environments.

### Environment Variables

No environment variables are required for basic functionality. Goals are stored in the file system.

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

If you encounter any issues, please open an issue on GitHub.
