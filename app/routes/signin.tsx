import { Button, Input } from "@nextui-org/react"
import { Form, json, redirect } from "@remix-run/react"
import { prisma } from "~/prisma.server"
import { userSessionStorage } from "~/session.server"
import type { ActionFunctionArgs } from "@remix-run/node"

export const action = async (c: ActionFunctionArgs) => {
  const formData = await c.request.formData()

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user || user.password !== password) {
    return json({
      success: false,
      errors: {
        username: "用户名密码不正确",
      },
    })
  }

  const session = await userSessionStorage.getSession(
    c.request.headers.get("Cookie"),
  )
  session.set("username", username)

  return redirect("/", {
    headers: {
      "Set-Cookie": await userSessionStorage.commitSession(session),
    },
  })
}

export default function Page() {
  return (
    <Form method="POST">
      <div className="p-12 flex flex-col gap-3">
        <Input name="username" label="用户" />
        <Input name="password" label="密码" type="password" />
        <Button type="submit" color="primary">
          登录
        </Button>
      </div>
    </Form>
  )
}
