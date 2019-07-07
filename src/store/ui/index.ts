import { Module, MutationTree } from 'vuex'

export interface UIState {
  headerTitle: string
}

const initState = (): UIState => {
  return {
    headerTitle: '',
  }
}

const mutations: MutationTree<UIState> = {
  setHeaderTitle(state, title: string) {
    state.headerTitle = title
  },
}

export const ui: Module<UIState, {}> = {
  namespaced: true,
  state: initState(),
  mutations,
}
