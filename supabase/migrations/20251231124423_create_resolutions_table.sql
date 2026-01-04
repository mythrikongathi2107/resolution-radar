/*
  # Create resolutions table for Resolution Radar 2026

  1. New Tables
    - `resolutions`
      - `id` (uuid, primary key) - Unique identifier for each resolution
      - `title` (text) - The resolution title
      - `category` (text) - Category: Health, Wealth, Tech, or Growth
      - `progress` (integer) - Progress percentage (0-100)
      - `why` (text) - The reason/motivation behind the resolution
      - `created_at` (timestamptz) - Timestamp when resolution was created
      - `updated_at` (timestamptz) - Timestamp when resolution was last updated
  
  2. Security
    - Enable RLS on `resolutions` table
    - Add policies for public access to allow all CRUD operations
    
  3. Notes
    - Progress is stored as integer between 0-100
    - Categories are validated via check constraint
    - Timestamps automatically managed
*/

CREATE TABLE IF NOT EXISTS resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('Health', 'Wealth', 'Tech', 'Growth')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  why text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON resolutions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON resolutions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON resolutions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON resolutions FOR DELETE
  TO anon
  USING (true);