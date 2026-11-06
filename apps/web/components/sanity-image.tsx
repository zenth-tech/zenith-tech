import Image from 'next/image'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/lib/sanity/image'
import type {Img} from '@/lib/types'
import {cn} from "@/lib/utils";

export function SanityImage({
															image,
															sizes = '(min-width: 1024px) 33vw, 100vw',
															ratio = 'aspect-[4/3]',
															imageClassName = '',
															priority = false,
															className = '',
															fallbackAlt = '',
														}: {
	image?: Img;
	sizes?: string;
	ratio?: string;
	priority?: boolean;
	className?: string;
	imageClassName?: string;
	fallbackAlt?: string
}) {
	if (!image?.asset?.url) {
		return <div aria-hidden className={`placeholder-bg ${ratio} w-full ${className}`}/>
	}
	const src = urlFor(image as unknown as SanityImageSource).width(1400).auto('format').url()
	const lqip = image.asset.metadata?.lqip
	return (
		<div className={cn("relative w-full overflow-hidden bg-mist", ratio, className)}>
			<Image
				src={src}
				alt={image.alt || fallbackAlt}
				fill
				sizes={sizes}
				priority={priority}
				className={cn("object-cover", imageClassName)}
				{...(lqip ? {placeholder: 'blur' as const, blurDataURL: lqip} : {})}
			/>
		</div>
	)
}
