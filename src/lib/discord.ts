import axios from "axios";

interface FeedbackNotification {
  content: string;
  userId: string;
  userName?: string;
  webhookUrl: string;
}

export async function sendDiscordNotification({
  content,
  userId,
  userName,
  webhookUrl,
}: FeedbackNotification) {
  if (!webhookUrl) {
    console.error("Discord Webhook URL이 설정되지 않았습니다.");
    return;
  }

  try {
    await axios.post(webhookUrl, {
      embeds: [
        {
          title: "📝 새로운 피드백이 등록되었습니다",
          description: content,
          color: 0x5865f2, // Discord 블루 컬러
          fields: [
            {
              name: "사용자 ID",
              value: userId,
              inline: true,
            },
            ...(userName
              ? [
                  {
                    name: "사용자 이름",
                    value: userName,
                    inline: true,
                  },
                ]
              : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error("Discord 알림 전송 실패:", error);
  }
}
