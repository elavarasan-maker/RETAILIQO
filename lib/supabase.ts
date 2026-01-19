
import { createClient } from '@supabase/supabase-js';

// Configuration provided by user for project zjhbmzfflfebnpxpiozo
const supabaseUrl = 'https://zjhbmzfflfebnpxpiozo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqaGJtemZmbGZlYm5weHBpb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDA4NjUsImV4cCI6MjA4NDMxNjg2NX0.erXxGvMe0lFzROAtxe9eXpsZWI17ZkwQh8MzMiAFcho';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
