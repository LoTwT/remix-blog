import { Button, Input } from "@nextui-org/react"
import { Form, redirect } from "@remix-run/react"
import { prisma } from "~/prisma.server"
import type { ActionFunctionArgs } from "@remix-run/node"

export const action = async (c: ActionFunctionArgs) => {
  const formData = await c.request.formData()

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  await prisma.user.create({
    data: {
      username,
      password,
    },
  })

  return redirect("/signin")
}

export default function Page() {
  return (
    <Form method="POST">
      <div className="p-12 flex flex-col gap-3">
        <Input name="username" label="用户名" />
        <Input name="password" label="密码" type="password" />
        <Button type="submit" color="primary">
          注册
        </Button>
      </div>
    </Form>
  )
}
