/*
  # Add Payment Fields to Assisted Sites Table

  1. Changes
    - Adds payment_session_id column to store Stripe session ID
    - Adds is_paid column to track payment status
    
  2. Notes
    - Uses DO block to check if columns exist before adding
    - Makes payment_session_id nullable since it might not be available at creation
    - Sets is_paid to false by default
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Add payment_session_id column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'payment_session_id'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN payment_session_id TEXT;
        END IF;
  
        -- Add is_paid column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'is_paid'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN is_paid BOOLEAN NOT NULL DEFAULT false;
        END IF;
      END $$;
    `);
}

export async function down(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Remove columns if they exist
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'payment_session_id'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN payment_session_id;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'is_paid'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN is_paid;
        END IF;
      END $$;
    `);
}
