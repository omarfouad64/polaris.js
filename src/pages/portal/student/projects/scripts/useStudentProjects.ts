import { useCallback, useMemo } from 'react';
import useDatabase from '../../../../../hooks/useDatabase';
import {
  addProject,
  updateProject as updateProjectAction,
  deleteProject as deleteProjectAction,
} from '../../../../../store/databaseSlice';

export type { ThesisDraft, ProjectTask } from '../../../../../store/initialData';
import type { ThesisDraft, ProjectTask } from '../../../../../store/initialData';

export interface ProjectData {
  id: string;
  ownerId: string;
  title: string;
  course?: string;
  isBachelorProject?: boolean;
  githubLink: string;
  projectReport: string;
  languages: string[];
  demoVideoUrl?: string;
  thesisDrafts: ThesisDraft[];
  tasks: ProjectTask[];
  createdDate: string;
  updatedDate: string;
  isPublic: boolean;
  status: 'active' | 'flagged';
  flagReason?: string;
}

/**
 * useStudentProjects — manages student project CRUD via Redux store.
 * All state is centralized; mutations are immediately visible across every component.
 */
export default function useStudentProjects(currentUserId?: string) {
  const { projects: rawProjects, dispatch, projectCollaborators } = useDatabase();

  const userCollabProjectIds = useMemo(() => {
    if (!currentUserId) return new Set<string>();
    const collabIds = projectCollaborators
      .filter(c => c.collaboratorId === currentUserId && c.invitationStatus === 'accepted')
      .map(c => c.projectId);
    return new Set(collabIds);
  }, [projectCollaborators, currentUserId]);

  const projects = useMemo(() => {
    const all = rawProjects as unknown as ProjectData[];
    if (!currentUserId) return all;
    return all.filter(p => {
      const isOwner = p.ownerId === currentUserId;
      const isCollaborator = userCollabProjectIds.has(p.id);
      return isOwner || isCollaborator;
    });
  }, [rawProjects, currentUserId, userCollabProjectIds]);

  const createProject = useCallback((project: Omit<ProjectData, 'id' | 'ownerId' | 'createdDate' | 'updatedDate'>) => {
    const newProject: ProjectData = {
      ...project,
      id: `proj-${Date.now()}`,
      ownerId: currentUserId ?? 'student_1',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };
    dispatch(addProject({ ...newProject, courseId: newProject.course, ownerId: currentUserId ?? 'student_1' }));
    return newProject;
  }, [dispatch, currentUserId]);

  const updateProject = useCallback((id: string, updates: Partial<Omit<ProjectData, 'id' | 'createdDate'>>) => {
    dispatch(updateProjectAction({
      id,
      ...updates,
      updatedDate: new Date().toISOString().split('T')[0],
    }));
  }, [dispatch]);

  const deleteProject = useCallback((id: string) => {
    dispatch(deleteProjectAction(id));
  }, [dispatch]);

  const getProjectById = useCallback((id: string): ProjectData | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading: false,
  };
}
