import { Test } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
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

const mockTasksService = {
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  deleteTaskById: jest.fn(),
  updateTaskStatus: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get(TasksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('calls TasksService.getTasks and returns tasks', async () => {
      mockTasksService.getTasks.mockResolvedValue([mockTask]);

      const result = await controller.getTasks(null, mockUser as any);

      expect(mockTasksService.getTasks).toHaveBeenCalledWith(null, mockUser);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksService.getTaskById and returns task', async () => {
      mockTasksService.getTaskById.mockResolvedValue(mockTask);

      const result = await controller.getTaskById('task-id', mockUser as any);

      expect(mockTasksService.getTaskById).toHaveBeenCalledWith(
        'task-id',
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('calls TasksService.createTask and returns task', async () => {
      const createTaskDto = {
        title: 'Test task',
        description: 'Test description',
      };

      mockTasksService.createTask.mockResolvedValue(mockTask);

      const result = await controller.createTask(
        createTaskDto,
        mockUser as any,
      );

      expect(mockTasksService.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTaskById', () => {
    it('calls TasksService.deleteTaskById', async () => {
      mockTasksService.deleteTaskById.mockResolvedValue(undefined);

      await controller.deleteTaskById('task-id', mockUser as any);

      expect(mockTasksService.deleteTaskById).toHaveBeenCalledWith(
        'task-id',
        mockUser,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TasksService.updateTaskStatus and returns updated task', async () => {
      const updateTaskStatusDto = {
        status: TaskStatus.DONE,
      };

      const updatedTask = {
        ...mockTask,
        status: TaskStatus.DONE,
      };

      mockTasksService.updateTaskStatus.mockResolvedValue(updatedTask);

      const result = await controller.updateTaskStatus(
        'task-id',
        updateTaskStatusDto,
        mockUser as any,
      );

      expect(mockTasksService.updateTaskStatus).toHaveBeenCalledWith(
        'task-id',
        TaskStatus.DONE,
        mockUser,
      );
      expect(result).toEqual(updatedTask);
    });
  });
});
