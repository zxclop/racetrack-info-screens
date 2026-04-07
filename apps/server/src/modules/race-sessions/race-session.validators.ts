import {
  CreateRaceSessionDto,
  UpdateRaceSessionDto,
} from './race-session.schemas';

const assertRaceWindow = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) {
    return;
  }

  if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
    throw new Error('endTime must be later than startTime');
  }
};

const normalizeDriverNames = (racerNames: string[]) => {
  if (racerNames.length > 8) {
    throw new Error('A race session can contain at most 8 drivers');
  }

  if (racerNames.length === 0) {
    return [];
  }

  const normalized = racerNames.map(name => name.trim());

  if (normalized.some(name => !name)) {
    throw new Error('Driver names cannot be empty');
  }

  const uniqueNames = new Set(normalized.map(name => name.toLowerCase()));

  if (uniqueNames.size !== normalized.length) {
    throw new Error('Driver names must be unique within a race session');
  }

  return normalized;
};

export const raceSessionValidators = {
  prepareCreate(data: CreateRaceSessionDto): CreateRaceSessionDto {
    assertRaceWindow(data.startTime, data.endTime);

    return {
      ...data,
      name: data.name.trim(),
      racerNames: normalizeDriverNames(data.racerNames),
    };
  },

  prepareUpdate(data: UpdateRaceSessionDto): UpdateRaceSessionDto {
    assertRaceWindow(data.startTime, data.endTime);

    return {
      ...data,
      name: data.name?.trim(),
      racerNames: data.racerNames
        ? normalizeDriverNames(data.racerNames)
        : data.racerNames,
    };
  },
};
