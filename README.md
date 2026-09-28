# NEXUM

NEXUM is a Profile Development Program platform designed for a team of eight visionary leaders. It serves as a central hub for the team to document their journey, share insights via daily journals and podcasts, capture memories in a time capsule, and receive appreciation from peers.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security)
- **Deployment**: Vercel

## Local Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```
2. **Environment Variables**: Copy the example env file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Supabase Configuration

### Migrations
The database schema is defined in four ordered migrations. You must run these in the Supabase SQL Editor in exact order:
1. `0001_init.sql`: Sets up core tables (profiles, articles, podcast_episodes, timeline_entries, appreciation_messages), enables RLS, and sets up base storage buckets.
2. `0002_time_capsule.sql`: Adds the `timeline_days` table and updates `timeline_entries` to support activities, milestones, and reflections.
3. `0003_appreciation_hardening.sql`: Hardens the Appreciation Wall with strict length constraints and a database trigger that forces anonymous submissions to a `pending` state.
4. `0004_team_members.sql`: Adds the `team_members` table, enforces strict string and array length constraints, and seeds the roster of 8 team members.

### Storage Buckets
The following storage buckets must be created (and made public) in Supabase. Migration 0001 attempts to create them, but verify in the dashboard:
- `journal-media`
- `podcast-audio`
- `timeline-media`
- `team-photos`

### Authentication & Team Accounts
- **Disable Public Sign-ups**: In your Supabase Dashboard under Auth > Providers > Email, disable "Allow new users to sign up". This ensures only authorized team members can access the admin dashboard.
- **Create Team Accounts**: Manually invite or create the 8 team member accounts via the Supabase Auth dashboard. Use their respective email addresses.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. **Environment Variables**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project settings.
4. **Deploy**.
5. **Update Supabase Auth URLs**: In the Supabase Dashboard, go to Auth > URL Configuration. Update the "Site URL" to your new Vercel production domain and add it to the "Redirect URLs".

## Team Guide

Welcome to the NEXUM Admin Dashboard! Here’s how to manage the platform:

- **Logging In**: Go to `/login` and enter the credentials provided by the admin team.
- **Publish a Journal Article**: Navigate to "Daily Journal" in the admin dashboard. Click "New Entry", fill in the content, optionally upload a cover image or PDF document, and click "Publish".
- **Upload a Podcast**: Go to "Podcasts", create a new episode, fill in the details, upload the audio file, and hit "Publish".
- **Add a Timeline Entry**: Go to "Time Capsule". You can add activities, milestones, or reflections under the appropriate day.
- **Moderate the Wall**: Go to "Appreciation Wall". You will see all pending messages submitted by the public. You can approve or permanently delete them. Only approved messages appear on the live site.
- **Edit a Profile**: Go to "Team Profiles". Click on your name to update your PDP Journey, Reflections, or upload a new profile photo. (Tags and bios can also be edited).
