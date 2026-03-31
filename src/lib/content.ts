import { Course, Lecture, Section, CourseContent } from './types';

export interface LectureMeta {
  id: string;
  number: number;
  title: string;
  chapter: string;
  color: string;
  icon: string;
}

export interface ContentIndex {
  lectures: Array<{ id: string; courseId: string; sections: string[] }>;
}

export interface CourseInfo {
  id: string;
  name: string;
  code: string;
  semester: string;
  instructor: string;
  color: string;
  icon: string;
}

// ── Caches ────────────────────────────────────────────────────────────────────

let cachedCourses: CourseInfo[] | null = null;
let cachedIndex: ContentIndex | null = null;
let cachedCourse: Course | null = null;
const cachedMetas: Record<string, LectureMeta> = {};
const cachedSections: Record<string, Section> = {};
const cachedLectures: Record<string, Lecture> = {};

// ── Primitives ────────────────────────────────────────────────────────────────

export async function getCourses(): Promise<CourseInfo[]> {
  if (cachedCourses) return cachedCourses;
  const res = await fetch('/content/courses.json');
  if (!res.ok) throw new Error('Failed to load /content/courses.json');
  cachedCourses = (await res.json()) as CourseInfo[];
  return cachedCourses;
}

export async function getCourseIndex(): Promise<ContentIndex> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch('/content/index.json');
  if (!res.ok) throw new Error('Failed to load /content/index.json');
  cachedIndex = (await res.json()) as ContentIndex;
  return cachedIndex;
}

export async function getCourse(): Promise<Course> {
  if (cachedCourse) return cachedCourse;
  const res = await fetch('/content/course.json');
  if (!res.ok) throw new Error('Failed to load /content/course.json');
  cachedCourse = (await res.json()) as Course;
  return cachedCourse;
}

export async function getLectureMeta(lectureId: string): Promise<LectureMeta> {
  if (cachedMetas[lectureId]) return cachedMetas[lectureId];
  const res = await fetch(`/content/${lectureId}/meta.json`);
  if (!res.ok) throw new Error(`Failed to load meta for ${lectureId}`);
  const meta = (await res.json()) as LectureMeta;
  cachedMetas[lectureId] = meta;
  return meta;
}

export async function getSection(lectureId: string, sectionId: string): Promise<Section> {
  const key = `${lectureId}/${sectionId}`;
  if (cachedSections[key]) return cachedSections[key];
  const res = await fetch(`/content/${lectureId}/${sectionId}.json`);
  if (!res.ok) throw new Error(`Failed to load section ${key}`);
  const section = (await res.json()) as Section;
  cachedSections[key] = section;
  return section;
}

// ── Compound loaders ──────────────────────────────────────────────────────────

/** Fetches meta + all section files for one lecture in parallel. */
export async function getFullLecture(lectureId: string): Promise<Lecture> {
  if (cachedLectures[lectureId]) return cachedLectures[lectureId];

  const index = await getCourseIndex();
  const entry = index.lectures.find((l) => l.id === lectureId);
  if (!entry) throw new Error(`Lecture ${lectureId} not found in index`);

  const [meta, ...sections] = await Promise.all([
    getLectureMeta(lectureId),
    ...entry.sections.map((sid) => getSection(lectureId, sid)),
  ]);

  const lecture: Lecture = { ...meta, courseId: entry.courseId, sections };
  cachedLectures[lectureId] = lecture;
  return lecture;
}

/** Fetches all lecture metas in parallel — used by the home page. */
export async function getAllLectureMetas(): Promise<LectureMeta[]> {
  const index = await getCourseIndex();
  return Promise.all(index.lectures.map((l) => getLectureMeta(l.id)));
}

// ── Legacy helper kept for backwards compatibility ────────────────────────────
// Pages that still call getContent() will continue to work.

let cachedContent: CourseContent | null = null;

export async function getContent(): Promise<CourseContent> {
  if (cachedContent) return cachedContent;

  const [course, index] = await Promise.all([getCourse(), getCourseIndex()]);
  const lectures = await Promise.all(index.lectures.map((l) => getFullLecture(l.id)));

  cachedContent = { course, lectures };
  return cachedContent;
}
