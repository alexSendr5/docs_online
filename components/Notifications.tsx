"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui"
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense"

import Image from "next/image"
import { ReactNode } from "react"

const Notifications = () => {
    const {inboxNotifications} = useInboxNotifications()
    const {count} = useUnreadInboxNotificationsCount()
    const unread = inboxNotifications.filter((notification) => !notification.readAt)
  return (
    <Popover>
    <PopoverTrigger className="flex relative size-10 items-center justify-center rounded-lg">
        <Image
        src = '/assets/icons/bell.svg'
        alt="inbox"
        width={24}
        height={24}
        />
        {count > 0 && (<div className="absolute top-2 right-2 z-20 size-2 rounded-full bg-blue-500"/>)}
    </PopoverTrigger>
    <PopoverContent align="end" className="shad-popover">
        <LiveblocksUIConfig overrides={{INBOX_NOTIFICATION_TEXT_MENTION:(user: ReactNode) => (<>
        {user} упомянул вас
        </>)}}>
            <InboxNotificationList>
                {unread.length <= 0 && (<p className="py-2 text-center text-blue-500">Нет уведомлений</p>)}
                {unread.length > 0 && unread.map((notification) => (
                    <InboxNotification
                    key = {notification.id}
                    inboxNotification = {notification}
                    className = 'bg-dark-200 text-white'
                    href={`/docs/${notification.roomId}`}
                    kinds={{
                      thread: (props) => (
                        <InboxNotification.Thread {...props}
                        showActions = {false}
                        showRoomName = {false}
                        />
                      ),
                      textMention: (props) => (
                        <InboxNotification.TextMention {...props}
                        showRoomName = {false}
                        />
                      ),
                      $documentAccess: (props) => (
                        <InboxNotification.Custom {...props} title = {props.inboxNotification.activities[0].data.title} aside = {
                          <InboxNotification.Icon className="bg-transparent">
                            <Image
                            src = {props.inboxNotification.activities[0].data.avatar as string || ''}
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="rounded-full"
                            />
                          </InboxNotification.Icon>
                        }>
                          {props.children}
                        </InboxNotification.Custom>
                      )
                    }}
                    />
                ))}
            </InboxNotificationList>
        </LiveblocksUIConfig>
    </PopoverContent>
  </Popover>
  )
}

export default Notifications