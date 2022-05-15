export function listMutator<T>(idKey: string) {
  const add = (entity: T, entities: T[]) => {
    const newEntities = [...entities, entity];
    return newEntities;
  };

  const update = (entity: T, entities: T[]) => {
    // @ts-ignore
    const index = entities.findIndex(e => e[this.idKey] === entity[this.idKey]);

    if (index > -1) {
      const newEntities = [...entities];
      newEntities[index] = entity;
      return newEntities;
    }

    return entities;
  };

  const remove = (id: string, entities: T[]) => {
    // @ts-ignore
    const index = entities.findIndex(e => e[idKey] === id);

    if (index > -1) {
      const newEntities = [...entities];
      newEntities.splice(index, 1);
      return newEntities;
    }

    return entities;
  };

  return {
    add,
    update,
    remove,
  };
}

