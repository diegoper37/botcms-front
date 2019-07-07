<template>
  <div>
    <img src="@/assets/cover.png">
    <beautiful-chat
      :participants="chatAttributes.participants"
      :titleImageUrl="chatAttributes.titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="chatAttributes.messageList"
      :newMessagesCount="chatAttributes.newMessagesCount"
      :isOpen="chatAttributes.isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showTypingIndicator="chatAttributes.showTypingIndicator"
      :colors="chatAttributes.colors"
      :alwaysScrollToBottom="chatAttributes.alwaysScrollToBottom"
      :messageStyling="chatAttributes.messageStyling"
      @onType="handleOnType"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import io from 'socket.io-client'
import { TextContent, TextContentAPI } from '@/apis/textContent'

@Component({})
export default class Chats extends Vue {
  socket = io(process.env.VUE_APP_API)
  chatAttributes = {
    // icons: {
    //   open: {
    //     img: OpenIcon,
    //     name: 'default',
    //   },
    //   close: {
    //     img: CloseIcon,
    //     name: 'default',
    //   },
    //   file: {
    //     img: FileIcon,
    //     name: 'default',
    //   },
    //   closeSvg: {
    //     img: CloseIconSvg,
    //     name: 'default',
    //   },
    // },
    participants: [
      {
        id: 'bot',
        name: 'BotCMS',
        imageUrl:
          'https://scontent.fpoa4-1.fna.fbcdn.net/v/t1.0-1/p40x40/64297967_1183034421878109_5429017800934948864_n.png?_nc_cat=101&_nc_oc=AQkcCCJ6nVmbyx48Bf2QechlaRY0JRiXLvw0-dKgInw5OdL3FiUZ36XHtI3hdksJ2QM&_nc_ht=scontent.fpoa4-1.fna&oh=daf6a67a94116e2704b4b3ddc86f4b3c&oe=5D8109FD',
      },
    ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
    titleImageUrl:
      'https://scontent.fpoa4-1.fna.fbcdn.net/v/t1.0-1/p40x40/64297967_1183034421878109_5429017800934948864_n.png?_nc_cat=101&_nc_oc=AQkcCCJ6nVmbyx48Bf2QechlaRY0JRiXLvw0-dKgInw5OdL3FiUZ36XHtI3hdksJ2QM&_nc_ht=scontent.fpoa4-1.fna&oh=daf6a67a94116e2704b4b3ddc86f4b3c&oe=5D8109FD',
    messageList: [{}], // the list of the messages to show, can be paginated and adjusted dynamically
    newMessagesCount: 0,
    isChatOpen: true, // to determine whether the chat window should be open or closed
    showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
    colors: {
      header: {
        bg: '#24ff95',
        text: '#8714ff',
      },
      launcher: {
        bg: '#24ff95',
      },
      messageList: {
        bg: '#ffffff',
      },
      sentMessage: {
        bg: '#24ff95',
        text: '#8714ff',
      },
      receivedMessage: {
        bg: '#e2e7ef',
        text: '#222222',
      },
      userInput: {
        bg: '#e2e7ef',
        text: '#8714ff',
      },
    }, // specifies the color scheme for the component
    alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
    messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
  }
  async sendMessage(text) {
    if (text.length > 0 || typeof text === 'object') {
      this.chatAttributes.newMessagesCount = this.chatAttributes.isChatOpen
        ? this.chatAttributes.newMessagesCount
        : this.chatAttributes.newMessagesCount++
      let contents = await TextContentAPI.getInstance().getTextContents()
      let total = contents.length - 1
      let suggestions = [
              contents[Math.floor(Math.random() * (total - 0)) + 0].name,
              contents[Math.floor(Math.random() * (total - 0)) + 0].name,
              contents[Math.floor(Math.random() * (total - 0)) + 0].name,
      ]
      this.chatAttributes.messageList = [
        ...this.chatAttributes.messageList,
        {
          author: 'Bot',
          type: text && text.type ? text.type : 'text',
          suggestions:
            this.chatAttributes.newMessagesCount < 1
              ? suggestions
              : '',
          data: text && text.type === 'emoji' ? { emoji: text.emoji } : { text },
        },
      ]

      // console.log(text)
      // console.log(this.chatAttributes.messageList)
    }
  }
  onMessageWasSent(message) {
    // called when the user sends a message
    this.socket.emit('SEND_MESSAGE', {
      message: message,
    })
    this.chatAttributes.messageList = [...this.chatAttributes.messageList, message]
  }
  openChat() {
    // called when the user clicks on the fab button to open the chat
    this.chatAttributes.isChatOpen = true
    this.chatAttributes.newMessagesCount = 0
  }
  closeChat() {
    // called when the user clicks on the botton to close the chat
    this.chatAttributes.isChatOpen = false
  }
  handleScrollToTop() {
    // called when the user scrolls message list to top
    // leverage pagination for loading another page of messages
  }
  handleOnType() {
    console.log('Emit typing event')
  }
  mounted() {
    this.socket.on('MESSAGE', data => {
      this.sendMessage(data.message)
    })
  }

  async fetchTextContents() {
    const response = await TextContentAPI.getInstance().getTextContents()
    return response
  }
}
</script>

<style>
.sc-suggestions-element {
  border-color: #8714ff !important;
  color: #8714ff !important;
}
</style>
