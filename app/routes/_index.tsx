import { Pagination } from "@nextui-org/react"
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { Link, useLoaderData, useSearchParams } from "@remix-run/react"
import { prisma } from "~/prisma.server"

export const meta: MetaFunction = () => {
  return [
    { title: "remix-blog" },
    { name: "description", content: "remix blog" },
  ]
}

const PAGE_SIZE = 1
export const loader = async (c: LoaderFunctionArgs) => {
  const search = new URL(c.request.url).searchParams
  const page = Number(search.get("page") || 1)

  // 用 prisma.$transaction() 进行组合查询
  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      orderBy: {
        created_at: "desc",
      },
      // 分页查询
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.post.count(),
  ])

  return json({
    posts,
    pageCount: Math.ceil(total / PAGE_SIZE),
  })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page") || 1)

  return (
    <div>
      <div className="p-12 flex flex-col gap-4">
        {loaderData.posts.map((post) => (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`} className="text-xl">
              {post.title}
            </Link>
            <div className="text-sm text-gray-400">{post.created_at}</div>
          </div>
        ))}

        <Pagination
          page={page}
          total={loaderData.pageCount}
          onChange={(p) => {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set("page", String(p))
            setSearchParams(newSearchParams)
          }}
        ></Pagination>
      </div>
    </div>
  )
}
