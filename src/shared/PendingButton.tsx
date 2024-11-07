import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingButton({ text }: { text: string }) {
	const pending = false;
	return (
		<Button type="submit" disabled={pending}>
			{pending &&
				<Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
			}
			{text}
		</Button>
	)
}