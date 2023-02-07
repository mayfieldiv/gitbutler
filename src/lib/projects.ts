import { invoke } from "@tauri-apps/api";
import { writable } from "svelte/store";

export type Project = {
    id: string;
    title: string;
    path: string;
};

const list = () => invoke<Project[]>("list_projects");

const add = (params: { path: string }) =>
    invoke<Project>("add_project", params);

export default async () => {
    const init = await list();
    const store = writable<Project[]>(init);
    return {
        subscribe: store.subscribe,
        add: (params: { path: string }) =>
            add(params).then((project) => {
                store.update((projects) => [...projects, project]);
                return project;
            }),
    };
};
