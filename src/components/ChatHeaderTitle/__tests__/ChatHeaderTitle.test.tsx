import React from 'react';
import {render} from '../../../../jest/test-utils';
import {ChatHeaderTitle} from '../ChatHeaderTitle';
import {chatSessionStore, modelStore} from '../../../store';
import {runInAction} from 'mobx';

describe('ChatHeaderTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Chat Page" when no active session exists', () => {
    runInAction(() => {
      chatSessionStore.resetActiveSession();
    });
    const {getByText} = render(<ChatHeaderTitle />);
    expect(getByText('Chat Page')).toBeTruthy();
  });

  it('renders session title when active session exists', () => {
    const mockSession = {
      id: '123',
      title: 'Test Session',
      date: new Date().toISOString(),
      messages: [],
    };
    runInAction(() => {
      Object.assign(chatSessionStore, {
        activeSessionId: mockSession.id,
        sessions: [mockSession],
      });
    });

    const {getByText} = render(<ChatHeaderTitle />);
    expect(getByText('Test Session')).toBeTruthy();
  });

  it('renders "Select a model" when no active model exists', () => {
    const {getByText} = render(<ChatHeaderTitle />);
    expect(getByText('Select a model')).toBeTruthy();
  });

  it('renders model name when active model exists', () => {
    const mockModel = {
      id: '456',
      name: 'GPT-4',
    };
    runInAction(() => {
      Object.assign(modelStore, {
        activeModel: mockModel,
      });
    });

    const {getByText} = render(<ChatHeaderTitle />);
    expect(getByText('GPT-4')).toBeTruthy();
  });

  it('updates when active model changes', () => {
    // Initial model
    const initialModel = {
      id: '456',
      name: 'GPT-4',
    };
    runInAction(() => {
      Object.assign(modelStore, {
        activeModel: initialModel,
      });
    });

    const {getByText, rerender} = render(<ChatHeaderTitle />);
    expect(getByText('GPT-4')).toBeTruthy();

    // Change model
    const newModel = {
      id: '789',
      name: 'Claude',
    };
    runInAction(() => {
      Object.assign(modelStore, {
        activeModel: newModel,
      });
    });

    rerender(<ChatHeaderTitle />);
    expect(getByText('Claude')).toBeTruthy();
  });
});
