import { clsx } from 'clsx'
import { BanknotesIcon, IdentificationIcon, LinkIcon, NewspaperIcon, PhotoIcon, TagIcon, TicketIcon, TruckIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/24/outline'

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-white/15 from-[2px] to-[2px] bg-[length:12px_100%]" />
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/5 from-[2px] to-[2px] bg-[length:12px_100%] group-last:hidden" />
      {children}
    </div>
  )
}

function Logo({
  label,
  src,
  DisplayIcon,
  className,
}: {
  label: string
  src: string
  DisplayIcon: any,
  className: string
}) {
  return (
    <div
      className={clsx(
        className,
        'absolute top-2 flex items-center gap-2 whitespace-nowrap px-2 py-1',
        'rounded-full bg-gradient-to-t from-gray-800 from-50% to-gray-700 ring-1 ring-inset ring-white/10',
        '[--move-x-from:-100%] [--move-x-to:calc(100%+100cqw)] [animation-iteration-count:infinite] [animation-name:move-x] [animation-timing-function:linear] [animation-play-state:running]',
      )}
    >
      {DisplayIcon ? <DisplayIcon className="text-white h-3 w-3 flex-shrink-0" /> : <>
        <img alt="" src={src} className="h-3 w-3 flex-shrink-0" />
      </>}
      <span className="text-xs font-medium text-white">{label}</span>
    </div>
  )
}

export function LogoTimeline() {
  return (
    <div aria-hidden="true" className="relative h-full overflow-hidden">
      <div className="absolute inset-0 top-8 z-10 flex items-center justify-center">
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            maskImage: `url('data:image/svg+xml,<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="12" fill="black"/></svg>')`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
          }}
        />
        <div className="relative flex size-24 items-center justify-center rounded-xl bg-gradient-to-t from-white/5 to-white/25 shadow outline outline-offset-[-5px] outline-white/5 ring-1 ring-inset ring-white/10">
          {/* <Mark className="h-9 fill-white" /> */}
          <img
            className='h-16 '
            src="https://cdn.brandfetch.io/shopify.com/w/453/h/512/symbol?c=1idpCXkgelXfNE59s5h"
            alt=''
          />
        </div>
      </div>
      <div className="absolute inset-0 grid grid-cols-1 pt-8 [container-type:inline-size]">
        <Row>
          <Logo
            DisplayIcon={UsersIcon}
            label="Customers"
            src=""
            className="[animation-delay:-26s] [animation-duration:30s]"
          />
          <Logo
            label="Products"
            src=""
            DisplayIcon={TruckIcon}

            className="[animation-delay:-8s] [animation-duration:30s]"
          />
        </Row>
        <Row>
          <Logo
            label="Categories"
            src="./logo-timeline/asana.svg"
            DisplayIcon={TagIcon}
            className="[animation-delay:-40s] [animation-duration:40s]"
          />
          <Logo
            label="Blog posts"
            src="./logo-timeline/microsoft-teams.svg"
            DisplayIcon={NewspaperIcon}
            className="[animation-delay:-20s] [animation-duration:40s]"
          />
        </Row>
        <Row>
          <Logo
            label="Orders"
            src="./logo-timeline/google-calendar.svg"
            DisplayIcon={BanknotesIcon}
            className="[animation-delay:-10s] [animation-duration:40s]"
          />
          <Logo
            label="Coupon codes"
            DisplayIcon={TicketIcon}
            src="./logo-timeline/google-drive.svg"
            className="[animation-delay:-32s] [animation-duration:40s]"
          />
        </Row>
        <Row>
          <Logo
            label="Discount Codes"
            DisplayIcon={TagIcon}
            src="./logo-timeline/basecamp.svg"
            className="[animation-delay:-45s] [animation-duration:45s]"
          />
          <Logo
            label="Metadata"
            DisplayIcon={IdentificationIcon}
            src="./logo-timeline/discord.svg"
            className="[animation-delay:-23s] [animation-duration:45s]"
          />
        </Row>
        <Row>
          <Logo
            label="301-redirects"
            DisplayIcon={LinkIcon}
            src="./logo-timeline/hubspot.svg"
            className="[animation-delay:-55s] [animation-duration:60s]"
          />
          <Logo
            label="Images"
            DisplayIcon={PhotoIcon}
            src="./logo-timeline/slack.svg"
            className="[animation-delay:-20s] [animation-duration:60s]"
          />
        </Row>
        {/* <Row>
          <Logo
            label="Adobe Creative Cloud"
            src="./logo-timeline/adobe-creative-cloud.svg"
            className="[animation-delay:-9s] [animation-duration:40s]"
          />
          <Logo
            label="Zoom"
            src="./logo-timeline/zoom.svg"
            className="[animation-delay:-28s] [animation-duration:40s]"
          />
        </Row> */}
      </div>
    </div>
  )
}
