import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';

const mockUser = {
  username: 'testuser',
  password: 'Test@1234',
};

const mockTask = {
  id: 'task-id',
  title: 'Test task',
  description: 'Test description',
  status: TaskStatus.OPEN,
  user: mockUser,
};

const mockTaskRepository = {
  getTasks: jest.fn(),
  store: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and returns tasks', async () => {
      mockTaskRepository.getTasks.mockResolvedValue([mockTask]);

      const result = await service.getTasks({}, mockUser as any);

      expect(mockTaskRepository.getTasks).toHaveBeenCalledWith({}, mockUser);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('createTask', () => {
    it('calls TaskRepository.store and returns task', async () => {
      const createTaskDto = {
        title: 'Test task',
        description: 'Test description',
      };

      mockTaskRepository.store.mockResolvedValue(mockTask);

      const result = await service.createTask(createTaskDto, mockUser as any);

      expect(mockTaskRepository.store).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskById', () => {
    it('returns task if found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.getTaskById('task-id', mockUser as any);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'task-id',
          user: { id: mockUser.id },
        },
      });

      expect(result).toEqual(mockTask);
    });

    it('throws NotFoundException if task is not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getTaskById('wrong-id', mockUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTaskById', () => {
    it('deletes task successfully', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteTaskById('task-id', mockUser as any);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith({
        id: 'task-id',
        user: { id: mockUser.id },
      });
    });

    it('throws NotFoundException if task is not found', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(
        service.deleteTaskById('wrong-id', mockUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates and returns task status', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...mockTask });
      mockTaskRepository.save.mockResolvedValue({
        ...mockTask,
        status: TaskStatus.DONE,
      });

      const result = await service.updateTaskStatus(
        'task-id',
        TaskStatus.DONE,
        mockUser as any,
      );

      expect(result.status).toEqual(TaskStatus.DONE);
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });
  });
});
