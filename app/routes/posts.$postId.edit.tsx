import { Button, Input, Textarea } from "@nextui-org/react"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node"
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { prisma } from "~/prisma.server"
import { auth } from "~/session.server"

export const loader = async (c: LoaderFunctionArgs) => {
  const user = await auth(c.request)
  if (!user.username) {
    return redirect("/signin")
  }

  const postId = c.params.postId as string
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Response("Post Not Found", { status: 404 })
  }

  return json({
    post,
  })
}

export const action = async (c: ActionFunctionArgs) => {
  const postId = c.params.postId as string
  const formData = await c.request.formData()

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const slug = formData.get("slug") as string

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      id: slug,
      title,
      content,
    },
  })

  return redirect(`/posts/${slug}`)
}

export default function Page() {
  const loaderData = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  const deleteFetcher = useFetcher()

  const isDeleteing = deleteFetcher.state === "submitting"
  const isEditing =
    navigation.state === "submitting" &&
    navigation.formData?.get("action") === "edit"

  return (
    <div className="p-12">
      <Form method="POST">
        <div className="flex flex-col gap-3">
          <Input name="slug" label="slug" defaultValue={loaderData.post.id} />
          <Input
            name="title"
            label="标题"
            defaultValue={loaderData.post.title}
          />
          <Textarea
            name="content"
            label="正文"
            minRows={10}
            defaultValue={loaderData.post.content}
          />
          <Button type="submit" color="primary" isLoading={isEditing}>
            更新
          </Button>
        </div>
      </Form>
      <div>
        <deleteFetcher.Form
          method="POST"
          action={`/posts/${loaderData.post.id}/delete`}
        >
          <Button
            name="action"
            value="delete"
            isLoading={isDeleteing}
            // type="submit"
            color="danger"
            onClick={(_) => {
              // eslint-disable-next-line no-alert
              if (confirm("确定删除吗？")) {
                deleteFetcher.submit(null, {
                  method: "POST",
                  action: `/posts/${loaderData.post.id}/delete`,
                })
              }
            }}
          >
            删除
          </Button>
        </deleteFetcher.Form>
      </div>
    </div>
  )
}
