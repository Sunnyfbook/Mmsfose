-- Grant admin role to the current user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('0db15ac7-5948-4af0-860b-01370f221096', 'admin'::app_role);