## Add Forgot Password Flow

### 1. Update Auth page (`src/pages/Auth.tsx`)
- Add a "Forgot password?" link below the login password field
- Clicking it reveals an inline email input + "Send reset link" button (or navigates to a small dialog)
- Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${window.location.origin}/reset-password })`
- Shows toast confirming email sent

### 2. Create Reset Password page (`src/pages/ResetPassword.tsx`)
- Public route at `/reset-password`
- Detects Supabase recovery session (set automatically when user clicks email link)
- Shows form with new password + confirm password fields
- Calls `supabase.auth.updateUser({ password })`
- On success, toast + redirect to `/admin`

### 3. Wire route in `src/App.tsx`
- Add `<Route path="/reset-password" element={<ResetPassword />} />` (public, outside ProtectedRoute)

### Notes
- Uses default Lovable Cloud auth emails — no custom email template setup needed
- The reset email link will route the user back to `/reset-password` where they set a new password
