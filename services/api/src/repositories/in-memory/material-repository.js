export const createInMemoryMaterialRepository = () => {
  const materialsById = new Map();

  return {
    listByLesson: (lessonId) =>
      Array.from(materialsById.values())
        .filter((item) => item.lessonId === lessonId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map((item) => ({ ...item })),

    insertMany: (materials) => {
      for (const material of materials) {
        materialsById.set(material.id, { ...material });
      }
      return materials.map((material) => ({ ...material }));
    },
  };
};
