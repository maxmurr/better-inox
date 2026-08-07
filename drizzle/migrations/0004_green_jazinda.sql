CREATE TABLE "course_lesson_progress" (
	"user_id" text NOT NULL,
	"course_slug" text NOT NULL,
	"lesson_id" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_lesson_progress_user_id_course_slug_lesson_id_pk" PRIMARY KEY("user_id","course_slug","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "course_quiz_result" (
	"user_id" text NOT NULL,
	"course_slug" text NOT NULL,
	"lesson_id" text NOT NULL,
	"question_outcomes" jsonb NOT NULL,
	"correct" integer NOT NULL,
	"total" integer NOT NULL,
	"passed" boolean NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_quiz_result_user_id_course_slug_lesson_id_pk" PRIMARY KEY("user_id","course_slug","lesson_id"),
	CONSTRAINT "course_quiz_result_correct_nonnegative" CHECK ("course_quiz_result"."correct" >= 0),
	CONSTRAINT "course_quiz_result_total_positive" CHECK ("course_quiz_result"."total" > 0),
	CONSTRAINT "course_quiz_result_correct_not_over_total" CHECK ("course_quiz_result"."correct" <= "course_quiz_result"."total")
);
--> statement-breakpoint
ALTER TABLE "course_lesson_progress" ADD CONSTRAINT "course_lesson_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_quiz_result" ADD CONSTRAINT "course_quiz_result_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;