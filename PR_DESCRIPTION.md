# Fix validation to allow courses with 0 credit hours

## Summary
- Fixed EditCourseModal validation that was preventing saves for courses with 0 credit hours
- Changed validation from 'Hours must be positive' to 'Hours must be non-negative'
- This allows editing courses that have 0 credit hours without validation errors

## Test plan
- Edit a course and set credit hours to 0
- Verify the Save Changes button is enabled
- Save the changes and verify they persist

## Related Issues
- Fixes the issue where Save Changes button doesn't work when editing courses with 0 hours

## PR URL
https://github.com/BonheurM/SEIVPROJECT2-Frontend/pull/new/fix/validation-zero-hours