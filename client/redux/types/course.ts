export interface CourseThumbnail {
  public_id?: string;
  url?: string;
}

export interface CourseLink {
  title: string;
  url: string;
}

export interface CourseLesson {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links?: CourseLink[];
  suggestion?: string;
}

export interface AdminCourse {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail?: CourseThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits?: Array<{ title: string }>;
  preRequisites?: Array<{ title: string }>;
  ratings?: number;
  purchased?: number;
  courseData?: CourseLesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAdminCoursesResponse {
  success: boolean;
  courses: AdminCourse[];
}

export interface GetAdminCourseResponse {
  success: boolean;
  course: AdminCourse;
}

export interface CreateCourseResponse {
  success: boolean;
  course: AdminCourse;
}

export interface EditCourseResponse {
  success: boolean;
  updatedCourse: AdminCourse;
}

export interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

export interface CoursePayload {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: Array<{ title: string }>;
  preRequisites: Array<{ title: string }>;
  courseData: Array<{
    title: string;
    description: string;
    videoUrl: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: CourseLink[];
    suggestion: string;
  }>;
  thumbnail?: string;
}

export interface PublicCourse {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail?: CourseThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits?: Array<{ title: string }>;
  preRequisites?: Array<{ title: string }>;
  ratings?: number;
  purchased?: number;
  courseData?: Array<{
    title: string;
    videoSection?: string;
    videoLength?: number;
  }>;
}

export interface GetPublicCourseResponse {
  success: boolean;
  course: PublicCourse;
}

export interface CoursePlayerMeta {
  _id: string;
  name: string;
  description: string;
  thumbnail?: CourseThumbnail;
  level: string;
  tags: string;
}

export interface GetCourseContentResponse {
  success: boolean;
  course: CoursePlayerMeta;
  content: CourseLesson[];
}

export interface VdoCipherPlayback {
  otp: string;
  playbackInfo: string;
}

export interface GenerateVideoUrlResponse {
  success: boolean;
  videoUrl: VdoCipherPlayback;
}

export interface CurriculumSection {
  key: string;
  title: string;
  videos: Array<CourseLesson & { key: string }>;
}
