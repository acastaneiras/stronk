import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Welcome = () => {
	return (
		<>
			<h1 className='text-3xl text-bold text-center'>Welcome!</h1>
			<p className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, praesentium unde voluptates sed rem fugit incidunt quos obcaecati dignissimos repudiandae aliquam, doloremque dolor soluta iste eaque nesciunt. Nesciunt, debitis velit.</p>
			<div className="grid w-full max-w-sm items-center my-8 gap-1.5">
				<div>
					<Label htmlFor="firstName">First Name <span className="text-red-600">*</span></Label>
					<Input id="firstName" type="text" placeholder="Enter your first name" />
				</div>
				<div>
					<Label htmlFor="lastName">Last Name <span className="text-red-600">*</span></Label>
					<Input id="lastName" type="text" placeholder="Enter your last name" />
				</div>
				<div>
					<Label htmlFor="alias">Alias <span className="text-xs text-gray-500">(optional)</span></Label>
					<Input id="alias" type="text" placeholder="Enter your alias" />
				</div>
			</div>
		</>
	)
}

export default Welcome