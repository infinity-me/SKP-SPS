import { pageService } from "@/lib/api"
import HeroBlock from "@/components/blocks/HeroBlock"
import FeaturesBlock from "@/components/blocks/FeaturesBlock"
import ContentBlock from "@/components/blocks/ContentBlock"
import { notFound } from "next/navigation"

// This maps the block types from DB to our React components
const BLOCK_COMPONENTS: Record<string, any> = {
    hero: HeroBlock,
    features: FeaturesBlock,
    content: ContentBlock,
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    let pageData = null

    try {
        const res = await pageService.getBySlug(params.slug)
        pageData = res.data.data
    } catch (error) {
        console.error("Error fetching dynamic page:", error)
    }

    if (!pageData) {
        // If it's a known static route, let Next.js handle it, otherwise 404
        // But since this is a catch-all, we should be careful
        if (["about", "contact", "admission", "fees", "gallery", "store", "calendar"].includes(params.slug)) {
            // These have their own folders in src/app/(public)/[slug]
            // Next.js will prioritize the folder over this catch-all
        } else {
            // notFound()
        }
    }

    return (
        <main className="min-h-screen">
            {(pageData?.blocks || []).map((block: any, i: number) => {
                const Component = BLOCK_COMPONENTS[block.type]
                if (!Component) return <div key={i} className="p-10 text-center bg-red-50 text-red-500 font-bold">Unknown Block Type: {block.type}</div>
                return <Component key={block.id || i} {...block.defaultProps} />
            })}
            
            {(!pageData || pageData.blocks?.length === 0) && (
                <div className="py-40 text-center">
                    <h1 className="text-4xl font-heading font-black text-primary uppercase italic">Page Under Construction</h1>
                    <p className="text-slate-400 mt-4">This dynamic page has no content blocks yet.</p>
                </div>
            )}
        </main>
    )
}
