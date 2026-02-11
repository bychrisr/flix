# Epic 4 Learning Complements (Materials and Quiz)
Epic goal: Complete the learning workflow by adding support content and assessment capability. This epic expands engagement and practical course delivery completeness.

## Story 4.1 Materials Upload and Attachment (Admin)
As an admin,
I want to upload support files per lesson,
so that learners can access complementary resources.

### Acceptance Criteria
1. Admin can upload multiple files to a lesson.
2. File type and size validation is enforced.
3. Uploaded assets are linked and retrievable per lesson.

## Story 4.2 Materials Access (Learner)
As a learner,
I want to view and download available lesson materials,
so that I can use supporting documents during study.

### Acceptance Criteria
1. Materials list is visible for released lessons.
2. Download links resolve to valid files.
3. Access respects lesson availability rules.

## Story 4.3 Quiz Authoring (Admin)
As an admin,
I want to create quizzes with questions and options,
so that I can assess learner comprehension.

### Acceptance Criteria
1. Quiz CRUD supports multiple questions and options.
2. Validation enforces at least one correct option per question.
3. Quiz structure persists consistently in database relations.

## Story 4.4 Quiz Submission and Result (Learner)
As a learner,
I want to submit quiz answers and get a result,
so that I can validate understanding immediately.

### Acceptance Criteria
1. Learner can submit one quiz attempt payload per flow.
2. System calculates score and pass/fail outcome.
3. Result view displays score summary and status.
