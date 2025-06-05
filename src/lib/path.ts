export class Path {
  static signIn() {
    return '/' as const
  }

  static verifyEmail() {
    return '/verify' as const
  }

  static callback() {
    return '/callback' as const
  }

  static workspaces() {
    return '/workspaces' as const
  }

  static indexes() {
    return '/indexes' as const
  }

  static indexDetail(uuid: string) {
    return `${Path.indexes()}/${uuid}` as const
  }

  static registerIndex(uuid: string) {
    return `${Path.indexDetail(uuid)}/register` as const
  }

  static addIndexData(uuid: string) {
    return `${Path.indexDetail(uuid)}/add-data` as const
  }

  static discoverAssistants() {
    return '/discover' as const
  }

  static manageAssistants() {
    return '/assistants' as const
  }

  static createAssistant() {
    return `${Path.manageAssistants()}/create` as const
  }

  static registerAssistant(assistantUuid: string) {
    return `${Path.manageAssistants()}/${assistantUuid}/register` as const
  }

  static editAssistant(assistantUuid: string) {
    return `${Path.manageAssistants()}/${assistantUuid}/edit` as const
  }

  static fileDetail(indexUuid: string, fileUuid: string) {
    return `${Path.indexDetail(indexUuid)}/files/${fileUuid}` as const
  }

  static test() {
    return '/test' as const
  }
}

export class SettingPath {
  static root() {
    return '/settings' as const
  }

  static user() {
    return `${SettingPath.root()}/user` as const
  }

  static workspace() {
    return `${SettingPath.root()}/workspace` as const
  }

  static dashboards() {
    return `${SettingPath.root()}/dashboards` as const
  }
}

export class ChatPath {
  static root() {
    return '/chats' as const
  }

  static assistant(assistantUuid: string) {
    return `${ChatPath.root()}/${assistantUuid}` as const
  }

  static assistantRoom(assistantUuid: string, roomUuid: string) {
    return `${ChatPath.assistant(assistantUuid)}/${roomUuid}` as const
  }

  static assistantRoomRoot(assistantUuid: string) {
    return `${ChatPath.assistant(assistantUuid)}` as const
  }
}

export const redirectServiceRootPath = Path.discoverAssistants()
